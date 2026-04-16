import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <PageShell>
      <section className="container-page pt-10">
        <Card className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold">关于项目</h1>
          <p className="text-slate-300">
            工位补能站是一个服务于打工人情绪场景的网页产品，通过今日状态签到、黑话翻译器、下班倒计时、
            精选共鸣内容和补能文案，帮助用户获得被理解、被释放、被安慰的感受。
          </p>
          <p className="text-slate-400">
            V1 版本以轻互动和传播效率为主，不做重社区、不强依赖登录，优先验证传播与复访。
          </p>
        </Card>
      </section>
    </PageShell>
  );
}
