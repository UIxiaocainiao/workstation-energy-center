import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function ContactoPage() {
  return (
    <PageShell>
      <section className="container-page pt-24">
        <Card className="flex flex-col gap-4">
          <h1 className="section-title text-3xl font-medium">Contacto</h1>
          <p className="text-white/75">
            有合作想法、产品共建或内容建议，欢迎直接联系。这个页面作为菜单中的 CONTACTO 对应入口。
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="mailto:hello@workstation-energy-center.dev"
              className="rounded-full border border-[var(--color-frost-border)] bg-white/[0.02] px-4 py-2 text-sm hover:bg-white/[0.08]"
            >
              发邮件
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-[var(--color-frost-border)] bg-white/[0.02] px-4 py-2 text-sm hover:bg-white/[0.08]"
            >
              了解项目
            </Link>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
