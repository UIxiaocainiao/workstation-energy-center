import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { useLocale } from "@/hooks/useLocale";
import Link from "next/link";

export default function ContactoPage() {
  const { isZh } = useLocale();

  return (
    <PageShell>
      <section className="container-page pt-24">
        <Card className="flex flex-col gap-4">
          <h1 className="section-title text-3xl font-medium">{isZh ? "联系反馈" : "Contact"}</h1>
          <p className="text-white/75">
            {isZh
              ? "有合作想法、产品共建或内容建议，欢迎直接联系。这个页面作为菜单中的 CONTACTO 对应入口。"
              : "If you have collaboration ideas, co-building opportunities, or content suggestions, feel free to reach out. This page is the CONTACTO entry in the menu."}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="mailto:hello@workstation-energy-center.dev"
              className="rounded-full border border-[var(--color-frost-border)] bg-white/[0.02] px-4 py-2 text-sm hover:bg-white/[0.08]"
            >
              {isZh ? "发邮件" : "Email Us"}
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-[var(--color-frost-border)] bg-white/[0.02] px-4 py-2 text-sm hover:bg-white/[0.08]"
            >
              {isZh ? "了解项目" : "About Project"}
            </Link>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
