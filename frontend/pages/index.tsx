import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusSign } from "@/components/features/StatusSign";
import { Countdown } from "@/components/features/Countdown";
import { Translator } from "@/components/features/Translator";
import { FeaturedCards } from "@/components/features/FeaturedCards";
import { ComfortBox } from "@/components/features/ComfortBox";

export default function HomePage() {
  return (
    <PageShell>
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
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#status-sign">
                <Button>领取今日状态</Button>
              </a>
              <Link href="/blackwords">
                <Button variant="secondary">试试黑话翻译器</Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>

      <section className="container-page mt-10">
        <StatusSign />
      </section>

      <section className="container-page mt-10">
        <Countdown />
      </section>

      <section className="container-page mt-10">
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
