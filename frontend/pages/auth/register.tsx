import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useAuthAwwwardsMotion } from "@/hooks/useAuthAwwwardsMotion";
import { useLocale } from "@/hooks/useLocale";
import { getApiErrorMessage } from "@/lib/httpError";

export default function RegisterPage() {
  const router = useRouter();
  const { isZh } = useLocale();
  const { registerWithEmail, isAuthenticated, isReady, startGoogleLogin, providers } = useAuth();
  const motionRootRef = useAuthAwwwardsMotion();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [registerMessage, setRegisterMessage] = useState("");

  const canSubmit = useMemo(
    () =>
      username.trim().length >= 2 &&
      email.trim().length > 0 &&
      password.length >= 8 &&
      repeatPassword.length >= 8 &&
      acceptTerms &&
      !submitting,
    [acceptTerms, email, password.length, repeatPassword.length, submitting, username],
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
      const message = await registerWithEmail({
        username: username.trim(),
        email: email.trim(),
        password,
        repeatPassword,
        acceptTerms,
        marketingOptIn,
      });
      setRegisterMessage(message);
      toast.success(isZh ? "注册成功" : "Account created successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, isZh ? "注册失败，请稍后重试" : "Registration failed, please try again"));
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
            <span className="auth-aw__headline-line">BUILD</span>
            <span className="auth-aw__headline-line">YOUR PROFILE</span>
          </h1>
          <p className="auth-aw__description">
            {isZh
              ? "创建账号后即可发布个人项目、配置作品展示和维护你的创意档案。"
              : "Create an account to publish your projects, configure showcases, and maintain your creative profile."}
          </p>
          <div className="auth-aw__hero-foot">
            <span>PORTFOLIO SYSTEM</span>
            <span>CURATED ACCESS</span>
          </div>
        </aside>

        <div className="auth-aw__card">
          <div className="auth-aw__topbar">
            <p className="auth-aw__card-title">{isZh ? "注册" : "Register"}</p>
            <Link href="/auth/login" className="auth-aw__ghost-link">
              {isZh ? "已有账号？" : "Already a member?"}
            </Link>
          </div>

          {registerMessage ? (
            <div className="auth-aw__success">
              <h2>{isZh ? "账号已创建" : "Account Created"}</h2>
              <p>{registerMessage}</p>
              <button type="button" className="auth-aw__primary" onClick={() => void router.push("/auth/login")}>
                {isZh ? "前往登录" : "Continue to Login"}
              </button>
            </div>
          ) : (
            <>
              <form className="auth-aw__form auth-aw__form--compact" onSubmit={onSubmit}>
                <label className="auth-aw__field">
                  <span>{isZh ? "用户名" : "Username"}</span>
                  <input
                    id="username"
                    autoComplete="username"
                    value={username}
                    placeholder="creative_handle"
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </label>

                <label className="auth-aw__field">
                  <span>{isZh ? "邮箱" : "Email"}</span>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    placeholder="you@example.com"
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </label>

                <label className="auth-aw__field">
                  <span>{isZh ? "密码" : "Password"}</span>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    placeholder={isZh ? "至少 8 位" : "Minimum 8 characters"}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </label>

                <label className="auth-aw__field">
                  <span>{isZh ? "重复密码" : "Repeat Password"}</span>
                  <input
                    id="repeatPassword"
                    type="password"
                    autoComplete="new-password"
                    value={repeatPassword}
                    placeholder={isZh ? "再次输入密码" : "Repeat password"}
                    onChange={(event) => setRepeatPassword(event.target.value)}
                  />
                </label>

                <label className="auth-aw__checkbox">
                  <input
                    type="checkbox"
                    checked={marketingOptIn}
                    onChange={(event) => setMarketingOptIn(event.target.checked)}
                  />
                  <span>{isZh ? "接收产品更新与活动邮件（可选）" : "Receive product updates and campaign emails (optional)"}</span>
                </label>

                <label className="auth-aw__checkbox">
                  <input type="checkbox" checked={acceptTerms} onChange={(event) => setAcceptTerms(event.target.checked)} />
                  <span>{isZh ? "我同意服务条款与隐私政策" : "I agree to the Terms and Conditions"}</span>
                </label>

                <button type="submit" className="auth-aw__primary" disabled={!canSubmit}>
                  {submitting ? (isZh ? "创建中..." : "Creating...") : isZh ? "创建账号" : "Create Account"}
                </button>
              </form>

              <div className="auth-aw__divider">{isZh ? "或快速注册" : "OR QUICK REGISTER"}</div>

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
            </>
          )}
        </div>
      </div>
    </section>
  );
}
