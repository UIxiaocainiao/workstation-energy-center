import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useAuthAwwwardsMotion } from "@/hooks/useAuthAwwwardsMotion";
import { useLocale } from "@/hooks/useLocale";
import { getApiErrorMessage } from "@/lib/httpError";

export default function LoginPage() {
  const router = useRouter();
  const { isZh } = useLocale();
  const { loginWithPassword, isAuthenticated, isReady, startGoogleLogin, providers } = useAuth();
  const motionRootRef = useAuthAwwwardsMotion();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => emailOrUsername.trim().length > 0 && password.length > 0 && !submitting,
    [emailOrUsername, password, submitting],
  );

  useEffect(() => {
    if (isReady && isAuthenticated) {
      void router.replace("/");
    }
  }, [isAuthenticated, isReady, router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      await loginWithPassword({
        emailOrUsername: emailOrUsername.trim(),
        password,
        keepLoggedIn,
      });
      toast.success(isZh ? "登录成功" : "Signed in successfully");
      await router.push("/");
    } catch (error) {
      toast.error(getApiErrorMessage(error, isZh ? "登录失败，请检查账号和密码" : "Sign-in failed. Please check your credentials."));
    } finally {
      setSubmitting(false);
    }
  }

  async function onGoogleLogin() {
    if (!providers.google.enabled) {
      toast.error(isZh ? "Google 登录未配置，请联系管理员配置后再试" : "Google sign-in is not configured. Please contact admin.");
      return;
    }

    try {
      await startGoogleLogin();
    } catch (error) {
      toast.error(getApiErrorMessage(error, isZh ? "Google 登录暂不可用" : "Google sign-in is temporarily unavailable"));
    }
  }

  return (
    <section className="auth-aw" ref={motionRootRef}>
      <div className="container-page auth-aw__grid">
        <aside className="auth-aw__hero">
          <p className="auth-aw__kicker">AWWWARDS INSPIRED / DARK PORTAL</p>
          <h1 className="auth-aw__headline">
            <span className="auth-aw__headline-line">CRAFTED</span>
            <span className="auth-aw__headline-line">ACCESS</span>
          </h1>
          <p className="auth-aw__description">
            {isZh
              ? "进入你的创作后台，继续发布作品、更新案例与维护个人展示页。"
              : "Access your creator dashboard to publish projects, update case studies, and maintain your profile page."}
          </p>
          <div className="auth-aw__hero-foot">
            <span>PORTFOLIO SYSTEM</span>
            <span>EST. 2026</span>
          </div>
        </aside>

        <div className="auth-aw__card">
          <div className="auth-aw__topbar">
            <p className="auth-aw__card-title">{isZh ? "登录" : "Login"}</p>
            <Link href="/auth/register" className="auth-aw__ghost-link">
              {isZh ? "创建账号" : "Create account"}
            </Link>
          </div>

          <form className="auth-aw__form" onSubmit={onSubmit}>
            <label className="auth-aw__field">
              <span>{isZh ? "邮箱 / 用户名" : "Email / Username"}</span>
              <input
                id="emailOrUsername"
                autoComplete="username"
                value={emailOrUsername}
                placeholder="you@example.com"
                onChange={(event) => setEmailOrUsername(event.target.value)}
              />
            </label>

            <label className="auth-aw__field">
              <span>{isZh ? "密码" : "Password"}</span>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                placeholder="••••••••"
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            <label className="auth-aw__checkbox">
              <input type="checkbox" checked={keepLoggedIn} onChange={(event) => setKeepLoggedIn(event.target.checked)} />
              <span>{isZh ? "30 天内保持登录" : "Keep me logged in for 30 days"}</span>
            </label>

            <button type="submit" className="auth-aw__primary" disabled={!canSubmit}>
              {submitting ? (isZh ? "登录中..." : "Signing in...") : isZh ? "进入后台" : "Enter Dashboard"}
            </button>
          </form>

          <div className="auth-aw__aux">
            <Link href="/auth/forgot-password" className="auth-aw__ghost-link">
              {isZh ? "忘记密码？" : "Forgot your password?"}
            </Link>
          </div>

          <div className="auth-aw__divider">{isZh ? "或使用以下方式" : "OR CONTINUE WITH"}</div>

          <div className="auth-aw__socials">
            <button
              type="button"
              className="auth-aw__social-btn"
              onClick={() => void onGoogleLogin()}
              disabled={!providers.google.enabled}
              title={providers.google.enabled ? (isZh ? "使用 Google 登录" : "Continue with Google") : isZh ? "Google 登录未配置" : "Google sign-in is not configured"}
            >
              {providers.google.enabled ? "Google" : isZh ? "Google（未配置）" : "Google (Not Configured)"}
            </button>
            <button type="button" className="auth-aw__social-btn" disabled>
              Twitter
            </button>
            <button type="button" className="auth-aw__social-btn" disabled>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
