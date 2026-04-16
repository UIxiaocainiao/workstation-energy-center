import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";

export default function Page() {
  return (
    <PageShell>
      <section className="container-page pt-10">
        <Card>
          <h1 className="section-title text-2xl font-medium">状态配置管理</h1>
          <p className="mt-2 text-[var(--color-silver)]">这里预留后台 CRUD 页面，后续可直接接入表格、表单和权限控制。</p>
        </Card>
      </section>
    </PageShell>
  );
}
