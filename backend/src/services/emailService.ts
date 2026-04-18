import { env } from "../config/env";

type SendResetPasswordEmailPayload = {
  toEmail: string;
  toName?: string;
  resetUrl: string;
};

type SendEmailResult = {
  ok: boolean;
  status?: number;
  error?: string;
};

export function isResetPasswordEmailConfigured() {
  return Boolean(env.resendApiKey && env.resendFromEmail);
}

function buildResetPasswordEmailHtml(payload: SendResetPasswordEmailPayload) {
  const displayName = payload.toName || payload.toEmail;
  return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111; line-height: 1.6;">
  <h2 style="margin: 0 0 12px;">你好，${displayName}</h2>
  <p style="margin: 0 0 14px;">我们收到了你的密码重置请求。点击下面按钮设置新密码：</p>
  <p style="margin: 0 0 18px;">
    <a href="${payload.resetUrl}" style="display:inline-block;padding:10px 16px;border-radius:999px;background:#111;color:#fff;text-decoration:none;">
      重置密码
    </a>
  </p>
  <p style="margin: 0 0 8px; color: #555;">如果按钮无法点击，请复制以下链接到浏览器：</p>
  <p style="word-break: break-all; margin: 0 0 18px; color: #333;">${payload.resetUrl}</p>
  <p style="margin: 0; color: #666; font-size: 13px;">如果这不是你本人操作，可以忽略本邮件。</p>
</div>
  `.trim();
}

export async function sendResetPasswordEmail(
  payload: SendResetPasswordEmailPayload,
): Promise<SendEmailResult> {
  if (!isResetPasswordEmailConfigured()) {
    return { ok: false, error: "email_not_configured" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.resendFromEmail,
      to: [payload.toEmail],
      subject: env.resetPasswordEmailSubject,
      html: buildResetPasswordEmailHtml(payload),
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    return {
      ok: false,
      status: response.status,
      error: text || "email_send_failed",
    };
  }

  return { ok: true, status: response.status };
}

