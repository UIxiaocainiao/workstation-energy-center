import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "@/hooks/useLocale";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";

const ERROR_MAP = {
  zh: {
    google_not_configured: "Google 登录尚未配置",
    google_missing_code: "Google 登录返回参数缺失",
    google_invalid_state: "登录状态校验失败，请重试",
    google_token_exchange_failed: "Google 授权换取失败",
    google_profile_failed: "Google 用户信息获取失败",
  },
  en: {
    google_not_configured: "Google sign-in is not configured",
    google_missing_code: "Missing parameters from Google callback",
    google_invalid_state: "Login state validation failed, please retry",
    google_token_exchange_failed: "Failed to exchange Google authorization",
    google_profile_failed: "Failed to fetch Google profile",
  },
} as const;

function parseHash(hash: string) {
  const params = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
  return {
    token: params.get("token"),
    error: params.get("error"),
  };
}

export default function OAuthCallbackPage() {
  const router = useRouter();
  const { isZh } = useLocale();
  const { establishSessionFromToken } = useAuth();
  const fallbackMessage = useMemo(
    () => (isZh ? "正在完成 Google 登录..." : "Completing Google sign-in..."),
    [isZh],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const { token, error } = parseHash(window.location.hash);

    if (error) {
      toast.error(ERROR_MAP[isZh ? "zh" : "en"][error as keyof (typeof ERROR_MAP)["zh"]] || (isZh ? "Google 登录失败" : "Google sign-in failed"));
      void router.replace("/auth/login");
      return;
    }

    if (!token) {
      toast.error(isZh ? "缺少登录凭证，请重试" : "Missing login credential, please retry");
      void router.replace("/auth/login");
      return;
    }

    establishSessionFromToken(token)
      .then(() => {
        toast.success(isZh ? "Google 登录成功" : "Google sign-in successful");
        return router.replace("/");
      })
      .catch(() => {
        toast.error(isZh ? "登录态校验失败，请重新登录" : "Session validation failed, please sign in again");
        return router.replace("/auth/login");
      });
  }, [establishSessionFromToken, isZh, router]);

  return (
    <PageShell>
      <section className="container-page auth-page-wrap">
        <Card className="auth-card">
          <p className="auth-eyebrow">OAuth Callback</p>
          <h1 className="section-title auth-title">{isZh ? "Google 登录" : "Google Sign In"}</h1>
          <p className="mt-4 text-sm text-white/70">{fallbackMessage}</p>
        </Card>
      </section>
    </PageShell>
  );
}
