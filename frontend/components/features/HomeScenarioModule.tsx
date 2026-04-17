import Link from "next/link";
import { useLayoutEffect, useMemo, useRef } from "react";
import { HomeSceneCanvas } from "@/components/features/HomeSceneCanvas";
import { Button } from "@/components/ui/Button";
import { createHeroTimeline, safeGsapContext, staggerReveal } from "@/lib/gsapUtils";

type TopicModule = {
  id: string;
  topicKey: string;
  topicTitle: string;
  targetPath: string;
  copies: number;
  sortOrder: number;
};

type TopicSeed = {
  text: string;
  target: string;
  copies: number;
};

type HomeScenarioModuleProps = {
  siteName: string;
  slogan: string;
  topicModules: TopicModule[];
  topicSeeds?: TopicSeed[];
  onStatusCta: () => void;
  onTranslatorCta: () => void;
  onCountdownCta: () => void;
  onComfortCta: () => void;
};

export function HomeScenarioModule({
  siteName,
  slogan,
  topicModules,
  topicSeeds,
  onStatusCta,
  onTranslatorCta,
  onCountdownCta,
  onComfortCta,
}: HomeScenarioModuleProps) {
  const rootRef = useRef<HTMLElement | null>(null);

  const highFrequencyScenes = useMemo(
    () => [
      {
        title: "早上通勤",
        description: "先领今天状态，避免一上来就硬扛。",
        action: "领取状态",
        onClick: onStatusCta,
      },
      {
        title: "午休空档",
        description: "翻译一句老板黑话，快速排压。",
        action: "试试翻译器",
        onClick: onTranslatorCta,
      },
      {
        title: "下午低能量",
        description: "看倒计时，给自己一个可见终点。",
        action: "查看倒计时",
        onClick: onCountdownCta,
      },
      {
        title: "下班前五分钟",
        description: "抽一句补能文案，把情绪收口。",
        action: "抽一句补能",
        onClick: onComfortCta,
      },
    ],
    [onComfortCta, onCountdownCta, onStatusCta, onTranslatorCta],
  );

  useLayoutEffect(() => {
    if (typeof window === "undefined") return undefined;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return undefined;

    const ctx = safeGsapContext(() => {
      const timeline = createHeroTimeline();
      timeline
        .from("[data-hero='kicker']", { autoAlpha: 0, y: 18, duration: 0.42 }, 0)
        .from("[data-hero='title']", { autoAlpha: 0, y: 34, duration: 0.68 }, 0.08)
        .from("[data-hero='desc']", { autoAlpha: 0, y: 20, duration: 0.56 }, 0.18)
        .from("[data-hero='actions'] > *", { autoAlpha: 0, y: 18, duration: 0.42, stagger: 0.08 }, 0.25);

      staggerReveal("[data-hero='scene-card']", { y: 16, duration: 0.56, delay: 0.36 });
      staggerReveal("[data-hero='topic-link']", { y: 12, duration: 0.45, delay: 0.5 });
    }, rootRef);

    return () => ctx?.revert();
  }, [topicModules.length]);

  return (
    <section ref={rootRef} className="home-hero-shell relative isolate min-h-[calc(100svh-4rem)] overflow-hidden">
      <HomeSceneCanvas topicSeeds={topicSeeds} />
      <div className="home-hero-overlay pointer-events-none absolute inset-0 z-[1]" />

      <div className="container-page relative z-[3] flex min-h-[calc(100svh-4rem)] items-end pb-12 pt-20 md:pb-16 md:pt-24">
        <div className="home-hero-panel w-full max-w-5xl rounded-3xl border border-[var(--color-frost-border)] p-6 md:p-8">
          <p data-hero="kicker" className="section-title text-xs uppercase tracking-[0.28em] text-white/65">
            workstation energy center
          </p>
          <h1 data-hero="title" className="display-hero mt-4 text-4xl leading-[0.95] md:text-6xl">
            {siteName}
          </h1>
          <p data-hero="desc" className="mt-4 max-w-2xl text-sm leading-6 text-white/78 md:text-base">
            {slogan}
          </p>

          <div data-hero="actions" className="mt-6 flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={onStatusCta}>
              领取今日状态
            </Button>
            <Button size="lg" variant="secondary" onClick={onTranslatorCta}>
              试试黑话翻译器
            </Button>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {highFrequencyScenes.map((scene) => (
              <div
                key={scene.title}
                data-hero="scene-card"
                className="rounded-2xl border border-white/15 bg-black/25 p-4 backdrop-blur-sm"
              >
                <div className="text-xs text-white/58">{scene.title}</div>
                <p className="mt-2 text-sm leading-6 text-white/85">{scene.description}</p>
                <button
                  className="mt-4 rounded-full border border-[var(--color-frost-border)] bg-white/[0.03] px-3 py-1.5 text-xs text-white/86 transition hover:bg-white/[0.12]"
                  onClick={scene.onClick}
                >
                  {scene.action}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {topicModules.map((module) => (
              <Link
                key={module.id}
                href={module.targetPath}
                data-hero="topic-link"
                className="rounded-full border border-white/20 bg-white/[0.03] px-3 py-1.5 text-xs text-white/76 transition hover:border-brand-500/40 hover:bg-brand-500/10 hover:text-brand-100"
              >
                {module.topicTitle}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
