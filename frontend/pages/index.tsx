import { useCallback } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusSign } from "@/components/features/StatusSign";
import { Countdown } from "@/components/features/Countdown";
import { Translator } from "@/components/features/Translator";
import { FeaturedCards } from "@/components/features/FeaturedCards";
import { ComfortBox } from "@/components/features/ComfortBox";

/** B-01/B-02/B-03: Smooth scroll to module + highlight title for 1.2s */
function scrollToModule(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  el.classList.add("module-highlight");
  setTimeout(() => el.classList.remove("module-highlight"), 1200);
}

export default function HomePage() {
  const handleScrollToStatus = useCallback(() => scrollToModule("status-sign"), []);
  const handleScrollToTranslator = useCallback(() => scrollToModule("translator"), []);

  return (
    <PageShell>
      {/* H-01: Banner - 3秒内说明产品定位 */}
      <section className="container-page pt-10 md:pt-16">
        <Card className="overflow-hidden p-8 md:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full bg-brand-500/10 px-3 py-1 text-xs text-brand-100">
              给打工人的情绪缓冲区
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              工位补能站
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              献给每一个表面正常上班、实际全靠硬撑的人。
            </p>
            {/* H-02: 双 CTA 入口 */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={handleScrollToStatus}>
                领取今日状态
              </Button>
              <Button variant="secondary" size="lg" onClick={handleScrollToTranslator}>
                翻译一句黑话
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* H-04: 签到 + 翻译 优先 */}
      <section className="container-page mt-10" id="status-sign">
        <StatusSign />
      </section>

      <section className="container-page mt-10">
        <Countdown />
      </section>

      <section className="container-page mt-10" id="translator">
        <Translator compact />
      </section>

      <section className="container-page mt-10">
        <FeaturedCards />
      </section>

      <section className="container-page mt-10">
        <ComfortBox />
      </section>
    </PageShell>
  );
}
