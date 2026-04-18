import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { useLocale } from "@/hooks/useLocale";

export default function AboutPage() {
  const { isZh } = useLocale();

  return (
    <PageShell>
      <section className="container-page pt-10">
        <Card className="flex flex-col gap-4">
          <h1 className="section-title text-3xl font-medium">{isZh ? "关于项目" : "About"}</h1>
          <p className="text-white/75">
            {isZh
              ? "工位补能站是一个服务于打工人情绪场景的网页产品，通过今日状态签到、精选共鸣内容和场景化互动，帮助用户获得被理解、被释放、被安慰的感受。"
              : "Workstation Energy Center is a web product for workplace emotional moments. Through daily mood check-ins, curated resonance content, and contextual interactions, it helps people feel seen, released, and comforted."}
          </p>
          <p className="text-[var(--color-silver)]">
            {isZh
              ? "V1 版本以轻互动和传播效率为主，不做重社区、不强依赖登录，优先验证传播与复访。"
              : "V1 focuses on lightweight interactions and sharing efficiency. It avoids heavy community mechanics and strict login dependency, prioritizing reach and revisit validation."}
          </p>
        </Card>
      </section>
    </PageShell>
  );
}
