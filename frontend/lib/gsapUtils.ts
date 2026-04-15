import { gsap } from "gsap";

export function safeFadeIn(target: string | Element, duration = 0.6, y = 20) {
  if (typeof window === "undefined") return;
  gsap.fromTo(
    target,
    { opacity: 0, y },
    { opacity: 1, y: 0, duration, ease: "power2.out" }
  );
}

export function staggerCards(targets: string | Element[], delayStep = 0.08) {
  if (typeof window === "undefined") return;
  gsap.fromTo(
    targets,
    { opacity: 0, y: 16 },
    {
      opacity: 1,
      y: 0,
      duration: 0.45,
      ease: "power2.out",
      stagger: delayStep
    }
  );
}

export const gsapMath = {
  clamp: gsap.utils.clamp,
  mapRange: gsap.utils.mapRange,
  normalize: gsap.utils.normalize,
  interpolate: gsap.utils.interpolate,
  random: gsap.utils.random,
  snap: gsap.utils.snap,
  wrap: gsap.utils.wrap,
  pipe: gsap.utils.pipe
};
