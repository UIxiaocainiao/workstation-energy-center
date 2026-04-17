import { HomeSceneCanvas } from "@/components/features/HomeSceneCanvas";
export function HomeScenarioModule() {
  return (
    <section className="home-hero-shell relative isolate min-h-[calc(100svh-4rem)] overflow-hidden">
      <HomeSceneCanvas />
      <div className="home-hero-overlay pointer-events-none absolute inset-0 z-[1]" />
    </section>
  );
}
