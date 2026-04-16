import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

const items = [
  { href: "/admin/statusManager", label: "状态配置管理" },
  { href: "/admin/cardsManager", label: "共鸣内容管理" },
  { href: "/admin/translatorManager", label: "翻译器语料管理" },
  { href: "/admin/comfortManager", label: "补能文案管理" }
];

export default function AdminPage() {
  return (
    <PageShell>
      <section className="container-page pt-10">
        <Card>
          <h1 className="section-title text-2xl font-medium">后台管理</h1>
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
