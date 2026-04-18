import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { useLocale } from "@/hooks/useLocale";
import Link from "next/link";

export default function AdminPage() {
  const { isZh } = useLocale();

  const items = [
    { href: "/admin/statusManager", label: isZh ? "状态配置管理" : "Status Config Manager" },
    { href: "/admin/cardsManager", label: isZh ? "共鸣内容管理" : "Resonance Content Manager" },
    { href: "/admin/topicModulesManager", label: isZh ? "话题模块管理" : "Topic Module Manager" },
  ];

  return (
    <PageShell>
      <section className="container-page pt-10">
        <Card>
          <h1 className="section-title text-2xl font-medium">{isZh ? "后台管理" : "Admin Panel"}</h1>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-[var(--color-frost-border)] bg-white/[0.02] p-4 transition hover:bg-white/[0.05]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
