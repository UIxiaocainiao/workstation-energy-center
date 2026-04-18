import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { env } from "../config/env";
import {
  generateSessionToken,
  hashPassword,
  hashToken,
  normalizeEmail,
  verifyPassword,
} from "../utils/auth";
import { createOAuthState, verifyOAuthState } from "../utils/oauthState";
import {
  isResetPasswordEmailConfigured,
  sendResetPasswordEmail,
} from "../services/emailService";

const registerSchema = z
  .object({
    username: z.string().trim().min(2).max(30),
    email: z.string().trim().email(),
    password: z.string().min(8).max(128),
    repeatPassword: z.string().min(8).max(128),
    acceptTerms: z.boolean(),
    marketingOptIn: z.boolean().optional().default(false),
  })
  .superRefine((value, ctx) => {
    if (value.password !== value.repeatPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["repeatPassword"],
        message: "两次输入的密码不一致",
      });
    }

    if (!value.acceptTerms) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["acceptTerms"],
        message: "请先同意服务条款",
      });
    }
  });

const loginSchema = z.object({
  emailOrUsername: z.string().trim().min(1),
  password: z.string().min(1),
  keepLoggedIn: z.boolean().optional().default(false),
});

const forgotPasswordSchema = z.object({
  emailOrUsername: z.string().trim().min(1),
});

const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8).max(128),
    repeatPassword: z.string().min(8).max(128),
  })
  .superRefine((value, ctx) => {
    if (value.password !== value.repeatPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["repeatPassword"],
        message: "两次输入的密码不一致",
      });
    }
  });

const googleAuthCodeSchema = z.object({
  code: z.string().min(1),
  state: z.string().min(1),
});

function sessionExpiresAt(keepLoggedIn: boolean) {
  const now = Date.now();
  const ttlMs = keepLoggedIn ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 60 * 24;
  return new Date(now + ttlMs);
}

function parseBearerToken(req: Request) {
  const raw = req.headers.authorization;
  if (!raw) return null;
  const [type, token] = raw.split(" ");
  if (type !== "Bearer" || !token) return null;
  return token;
}

function safeUser(user: {
  id: string;
  username: string;
  email: string;
  emailVerifiedAt: Date | null;
}) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    emailVerified: Boolean(user.emailVerifiedAt),
  };
}

function isGoogleConfigured() {
  return Boolean(env.googleClientId && env.googleClientSecret && env.googleRedirectUri);
}

function buildOAuthCallbackUrl(fragment: Record<string, string>) {
  const hash = new URLSearchParams(fragment).toString();
  return `${env.clientOrigin}/auth/oauth-callback#${hash}`;
}

function normalizeUsernameSeed(input: string) {
  const value = input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}._-]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return value.slice(0, 24) || "user";
}

async function createUniqueUsername(seed: string) {
  const base = normalizeUsernameSeed(seed);

  for (let index = 0; index < 20; index += 1) {
    const suffix = index === 0 ? "" : `${Math.floor(100 + Math.random() * 900)}`;
    const candidate = `${base}${suffix}`.slice(0, 30);
    const exists = await prisma.user.findUnique({
      where: { username: candidate },
      select: { id: true },
    });
    if (!exists) return candidate;
  }

  return `${base}${Date.now().toString().slice(-4)}`.slice(0, 30);
}

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type GoogleUserInfo = {
  email?: string;
  email_verified?: boolean;
  name?: string;
  sub?: string;
};

export async function getAuthProviders(_req: Request, res: Response) {
  return res.json({
    providers: {
      google: {
        enabled: isGoogleConfigured(),
      },
      twitter: {
        enabled: false,
      },
      facebook: {
        enabled: false,
      },
    },
  });
}

export async function registerWithEmail(req: Request, res: Response) {
  const body = registerSchema.parse(req.body);
  const email = normalizeEmail(body.email);
  const username = body.username.trim();

  const duplicate = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
    select: { id: true, email: true, username: true },
  });

  if (duplicate) {
    return res.status(409).json({
      message:
        duplicate.email === email ? "该邮箱已注册" : "该用户名已被占用",
    });
  }

  await prisma.user.create({
    data: {
      username,
      email,
      passwordHash: hashPassword(body.password),
      marketingOptIn: body.marketingOptIn,
      // Awwwards 风格是邮件验证，这里在本地开发环境默认视为已完成验证。
      emailVerifiedAt: new Date(),
    },
  });

  return res.json({
    message: "注册成功，验证邮件已发送（开发环境已自动验证）。",
  });
}

export async function loginWithPassword(req: Request, res: Response) {
  const body = loginSchema.parse(req.body);
  const credential = body.emailOrUsername.trim();
  const normalizedEmail = normalizeEmail(credential);

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: normalizedEmail }, { username: credential }],
    },
  });

  if (!user || !verifyPassword(body.password, user.passwordHash)) {
    return res.status(401).json({ message: "账号或密码错误" });
  }

  await prisma.authSession.deleteMany({
    where: { userId: user.id, expiresAt: { lt: new Date() } },
  });

  const token = generateSessionToken();
  const tokenHash = hashToken(token);

  await prisma.authSession.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: sessionExpiresAt(body.keepLoggedIn),
    },
  });

  return res.json({
    token,
    user: safeUser(user),
  });
}

export async function forgotPassword(req: Request, res: Response) {
  const body = forgotPasswordSchema.parse(req.body);
  const credential = body.emailOrUsername.trim();
  const normalizedEmail = normalizeEmail(credential);

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: normalizedEmail }, { username: credential }],
    },
    select: { id: true, email: true, username: true },
  });

  let debugResetToken: string | undefined;
  let debugResetUrl: string | undefined;
  let debugEmailDelivery: "sent" | "skipped" | "failed" | undefined;

  if (user) {
    const rawToken = generateSessionToken();
    const resetUrl = `${env.clientOrigin}/auth/reset-password?token=${encodeURIComponent(rawToken)}`;

    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(rawToken),
        expiresAt: new Date(Date.now() + 1000 * 60 * 30),
      },
    });

    if (isResetPasswordEmailConfigured()) {
      try {
        const result = await sendResetPasswordEmail({
          toEmail: user.email,
          toName: user.username,
          resetUrl,
        });
        if (process.env.NODE_ENV !== "production") {
          debugEmailDelivery = result.ok ? "sent" : "failed";
        }
        if (!result.ok) {
          console.error("Failed to send reset password email:", result.error);
        }
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          debugEmailDelivery = "failed";
        }
        console.error("Failed to send reset password email:", error);
      }
    } else if (process.env.NODE_ENV !== "production") {
      debugEmailDelivery = "skipped";
    }

    if (process.env.NODE_ENV !== "production") {
      debugResetToken = rawToken;
      debugResetUrl = resetUrl;
    }
  }

  return res.json({
    message: "如果账号存在，我们已发送重置密码邮件。",
    ...(debugResetToken
      ? {
          debugResetToken,
          debugResetUrl,
        }
      : {}),
    ...(debugEmailDelivery ? { debugEmailDelivery } : {}),
  });
}

export async function resetPassword(req: Request, res: Response) {
  const body = resetPasswordSchema.parse(req.body);
  const tokenHash = hashToken(body.token);

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!record || record.usedAt || record.expiresAt <= new Date()) {
    return res.status(400).json({ message: "重置链接无效或已过期" });
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash: hashPassword(body.password) },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    prisma.passwordResetToken.deleteMany({
      where: {
        userId: record.userId,
        id: { not: record.id },
      },
    }),
    prisma.authSession.deleteMany({
      where: { userId: record.userId },
    }),
  ]);

  return res.json({ message: "密码已重置，请使用新密码登录" });
}

export async function getGoogleAuthUrl(_req: Request, res: Response) {
  if (!isGoogleConfigured()) {
    return res.status(503).json({
      message: "Google 登录未配置，请先设置 GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REDIRECT_URI",
    });
  }

  const state = createOAuthState();
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", env.googleClientId);
  url.searchParams.set("redirect_uri", env.googleRedirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "select_account");

  return res.json({ url: url.toString() });
}

export async function handleGoogleCallback(req: Request, res: Response) {
  if (!isGoogleConfigured()) {
    return res.redirect(
      302,
      buildOAuthCallbackUrl({ error: "google_not_configured" }),
    );
  }

  const parsed = googleAuthCodeSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.redirect(
      302,
      buildOAuthCallbackUrl({ error: "google_missing_code" }),
    );
  }

  if (!verifyOAuthState(parsed.data.state)) {
    return res.redirect(302, buildOAuthCallbackUrl({ error: "google_invalid_state" }));
  }

  let tokenResult: GoogleTokenResponse;
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: parsed.data.code,
        client_id: env.googleClientId,
        client_secret: env.googleClientSecret,
        redirect_uri: env.googleRedirectUri,
        grant_type: "authorization_code",
      }),
    });
    tokenResult = (await tokenResponse.json()) as GoogleTokenResponse;
    if (!tokenResponse.ok || !tokenResult.access_token) {
      return res.redirect(302, buildOAuthCallbackUrl({ error: "google_token_exchange_failed" }));
    }
  } catch {
    return res.redirect(302, buildOAuthCallbackUrl({ error: "google_token_exchange_failed" }));
  }

  let profile: GoogleUserInfo;
  try {
    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokenResult.access_token}` },
    });
    profile = (await profileResponse.json()) as GoogleUserInfo;
    if (!profileResponse.ok || !profile.email) {
      return res.redirect(302, buildOAuthCallbackUrl({ error: "google_profile_failed" }));
    }
  } catch {
    return res.redirect(302, buildOAuthCallbackUrl({ error: "google_profile_failed" }));
  }

  const email = normalizeEmail(profile.email);
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const username = await createUniqueUsername(profile.name || email.split("@")[0] || profile.sub || "user");
    user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashPassword(generateSessionToken()),
        emailVerifiedAt: profile.email_verified ? new Date() : null,
      },
    });
  } else if (profile.email_verified && !user.emailVerifiedAt) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifiedAt: new Date() },
    });
  }

  const sessionToken = generateSessionToken();
  await prisma.authSession.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(sessionToken),
      expiresAt: sessionExpiresAt(true),
    },
  });

  return res.redirect(
    302,
    buildOAuthCallbackUrl({ token: sessionToken }),
  );
}

export async function getCurrentUser(req: Request, res: Response) {
  const token = parseBearerToken(req);
  if (!token) {
    return res.status(401).json({ message: "未登录" });
  }

  const session = await prisma.authSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  if (!session || session.expiresAt <= new Date()) {
    if (session?.id) {
      await prisma.authSession.deleteMany({
        where: { id: session.id },
      });
    }
    return res.status(401).json({ message: "登录状态已失效，请重新登录" });
  }

  return res.json({ user: safeUser(session.user) });
}

export async function logout(req: Request, res: Response) {
  const token = parseBearerToken(req);
  if (token) {
    await prisma.authSession.deleteMany({
      where: { tokenHash: hashToken(token) },
    });
  }
  return res.json({ ok: true });
}
