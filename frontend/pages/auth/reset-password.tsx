import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { AuthModalLayout } from "@/components/auth/AuthModalLayout";
import { useAuth } from "@/hooks/useAuth";
import { useAuthAwwwardsMotion } from "@/hooks/useAuthAwwwardsMotion";
import { useLocale } from "@/hooks/useLocale";
import { getApiErrorMessage } from "@/lib/httpError";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { isZh } = useLocale();
  const { resetPassword } = useAuth();
  const motionRootRef = useAuthAwwwardsMotion();
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const token = useMemo(() => {
    const value = router.query.token;
    if (typeof value === "string") return value;
    return "";
  }, [router.query.token]);

  const canSubmit = useMemo(
    () => token.length > 0 && password.length >= 8 && repeatPassword.length >= 8 && !submitting,
    [token, password.length, repeatPassword.length, submitting],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      const message = await resetPassword({ token, password, repeatPassword });
      setDone(true);
      toast.success(message);
    } catch (error) {
      toast.error(getApiErrorMessage(error, isZh ? "重置密码失败" : "Failed to reset password"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthModalLayout>
      <section className="auth-aw auth-aw--modal" ref={motionRootRef}>
        <div className="container-page auth-aw__grid">
          <aside className="auth-aw__hero">
            <p className="auth-aw__kicker">AWWWARDS INSPIRED / DARK PORTAL</p>
            <h1 className="auth-aw__headline">
              SET NEW
              <br />
              PASSWORD
            </h1>
            <p className="auth-aw__description">
              {isZh
                ? "使用重置链接为你的账号设置一个新密码，完成后可立即重新登录。"
                : "Use the reset link to set a new password. Once complete, you can sign in immediately."}
            </p>
            <div className="auth-aw__hero-foot">
              <span>SECURE FLOW</span>
              <span>TOKEN-BASED</span>
            </div>
          </aside>

          <div className="auth-aw__card">
            <div className="auth-aw__topbar">
              <p className="auth-aw__card-title">{isZh ? "重置密码" : "Reset Password"}</p>
              <Link href="/auth/login" className="auth-aw__ghost-link">
                {isZh ? "返回登录" : "Back to login"}
              </Link>
            </div>

            {!token ? (
              <p className="auth-aw__help">
                {isZh
                  ? "当前链接缺少 `token` 参数，请从重置邮件链接或忘记密码页重新进入。"
                  : "The current link is missing the `token` parameter. Please re-open from your reset email or the forgot-password page."}
              </p>
            ) : done ? (
              <div className="auth-aw__success">
                <h2>{isZh ? "密码已更新" : "Password Updated"}</h2>
                <p>{isZh ? "你的密码已更新，现在可以用新密码登录。" : "Your password has been updated. You can now sign in with it."}</p>
                <button type="button" className="auth-aw__primary" onClick={() => void router.push("/auth/login")}>
                  {isZh ? "立即登录" : "Log in now"}
                </button>
              </div>
            ) : (
              <form className="auth-aw__form" onSubmit={onSubmit}>
                <label className="auth-aw__field">
                  <span>{isZh ? "新密码" : "New Password"}</span>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    placeholder={isZh ? "至少 8 位" : "At least 8 characters"}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </label>

                <label className="auth-aw__field">
                  <span>{isZh ? "重复新密码" : "Repeat New Password"}</span>
                  <input
                    id="repeatPassword"
                    type="password"
                    autoComplete="new-password"
                    value={repeatPassword}
                    placeholder={isZh ? "再次输入新密码" : "Repeat your new password"}
                    onChange={(event) => setRepeatPassword(event.target.value)}
                  />
                </label>

                <button type="submit" className="auth-aw__primary" disabled={!canSubmit}>
                  {submitting ? (isZh ? "更新中..." : "Updating...") : isZh ? "重置密码" : "Reset password"}
                </button>
              </form>
            )}

            <div className="auth-aw__links">
              <Link href="/auth/forgot-password" className="auth-aw__ghost-link">
                {isZh ? "重新申请链接" : "Request new link"}
              </Link>
              <Link href="/auth/login" className="auth-aw__ghost-link">
                {isZh ? "登录" : "Login"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AuthModalLayout>
  );
}
