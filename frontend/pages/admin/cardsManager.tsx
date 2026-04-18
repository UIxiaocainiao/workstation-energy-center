import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { useLocale } from "@/hooks/useLocale";

export default function Page() {
  const { isZh } = useLocale();

  return (
    <PageShell>
      <section className="container-page pt-10">
        <Card>
          <h1 className="section-title text-2xl font-medium">{isZh ? "共鸣内容管理" : "Resonance Content Manager"}</h1>
          <p className="mt-2 text-[var(--color-silver)]">
            {isZh
              ? "这里预留后台 CRUD 页面，后续可直接接入表格、表单和权限控制。"
              : "This is a reserved CRUD page for admin operations. Tables, forms, and access control can be integrated directly here."}
          </p>
        </Card>
      </section>
    </PageShell>
  );
}
