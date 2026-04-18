import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AuthModalLayout } from "@/components/auth/AuthModalLayout";
import { useAuth } from "@/hooks/useAuth";
import { useAuthAwwwardsMotion } from "@/hooks/useAuthAwwwardsMotion";
import { useLocale } from "@/hooks/useLocale";
import { getApiErrorMessage } from "@/lib/httpError";

export default function ForgotPasswordPage() {
  const { isZh } = useLocale();
  const { forgotPassword } = useAuth();
  const motionRootRef = useAuthAwwwardsMotion();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [message, setMessage] = useState("");
  const [debugResetUrl, setDebugResetUrl] = useState("");
  const [debugEmailDelivery, setDebugEmailDelivery] = useState<"sent" | "skipped" | "failed" | "">("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => emailOrUsername.trim().length > 0 && !submitting, [emailOrUsername, submitting]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      const result = await forgotPassword(emailOrUsername.trim());
      setMessage(result.message);
      setDebugResetUrl(result.debugResetUrl || "");
      setDebugEmailDelivery(result.debugEmailDelivery || "");
      toast.success(isZh ? "请求已提交" : "Request submitted");
    } catch (error) {
      toast.error(getApiErrorMessage(error, isZh ? "提交失败，请稍后重试" : "Submission failed, please try again"));
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
              RESET
              <br />
              ACCESS
            </h1>
            <p className="auth-aw__description">
              {isZh
                ? "输入你的账号标识，我们会发送密码重置链接到邮箱，帮助你快速恢复访问权限。"
                : "Enter your account identifier and we'll send a password reset link to your email so you can restore access quickly."}
            </p>
            <div className="auth-aw__hero-foot">
              <span>SECURE FLOW</span>
              <span>PASSWORD RESET</span>
            </div>
          </aside>

          <div className="auth-aw__card">
            <div className="auth-aw__topbar">
              <p className="auth-aw__card-title">{isZh ? "忘记密码" : "Forgot Password"}</p>
              <Link href="/auth/login" className="auth-aw__ghost-link">
                {isZh ? "返回登录" : "Back to login"}
              </Link>
            </div>

            <p className="auth-aw__inline-note">
              {isZh
                ? "输入用户名或邮箱，我们会发送安全的重置链接。"
                : "Enter your username or email and we will send a secure reset link."}
            </p>

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

              <button type="submit" className="auth-aw__primary" disabled={!canSubmit}>
                {submitting ? (isZh ? "提交中..." : "Submitting...") : isZh ? "发送重置链接" : "Send Reset Link"}
              </button>
            </form>

            {message && <p className="auth-aw__help">{message}</p>}

            {debugResetUrl && (
              <div className="auth-aw__debug">
                <p>
                  {isZh ? "邮件发送状态：" : "Email delivery status:"}
                  {debugEmailDelivery === "sent" && (isZh ? "已发送" : "Sent")}
                  {debugEmailDelivery === "skipped" && (isZh ? "未配置邮件服务（使用调试链接）" : "Mail service not configured (using debug link)")}
                  {debugEmailDelivery === "failed" && (isZh ? "发送失败（请检查 Resend 配置）" : "Failed (please check Resend config)")}
                  {!debugEmailDelivery && (isZh ? "未知" : "Unknown")}
                </p>
                <p>{isZh ? "开发环境调试链接：" : "Development debug URL:"}</p>
                <a href={debugResetUrl}>{debugResetUrl}</a>
              </div>
            )}

            <div className="auth-aw__links">
              <Link href="/auth/register" className="auth-aw__ghost-link">
                {isZh ? "还没有账号？" : "Need an account?"}
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
