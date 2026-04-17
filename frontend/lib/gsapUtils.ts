import type { RefObject } from "react";
import { gsap } from "gsap";

type ScopeElement = Element | RefObject<Element | null> | null | undefined;

type RevealOptions = {
  y?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  autoAlpha?: number;
};

function resolveScope(scope: ScopeElement) {
  if (!scope) return undefined;
  if ("current" in scope) return scope.current ?? undefined;
  return scope;
}

export function safeGsapContext(callback: () => void, scope?: ScopeElement) {
  if (typeof window === "undefined") return null;
  const target = resolveScope(scope);
  if (!target) {
    callback();
    return null;
  }
  return gsap.context(callback, target);
}

export function fadeInUp(target: gsap.TweenTarget, options: RevealOptions = {}) {
  const { y = 24, duration = 0.6, delay = 0, ease = "power3.out", autoAlpha = 0 } = options;
  if (typeof window === "undefined") return null;
  return gsap.fromTo(
    target,
    { autoAlpha, y },
    {
      autoAlpha: 1,
      y: 0,
      duration,
      delay,
      ease,
    },
  );
}

export function staggerReveal(targets: gsap.TweenTarget, options: RevealOptions = {}) {
  const { y = 20, duration = 0.6, delay = 0, ease = "power3.out", autoAlpha = 0 } = options;
  if (typeof window === "undefined") return null;
  return gsap.fromTo(
    targets,
    { autoAlpha, y },
    {
      autoAlpha: 1,
      y: 0,
      duration,
      delay,
      stagger: 0.08,
      ease,
    },
  );
}

export function createHeroTimeline() {
  return gsap.timeline({
    defaults: {
      duration: 0.6,
      ease: "power3.out",
    },
  });
}

export function createScrollReveal(target: HTMLElement, threshold = 0.15) {
  if (typeof window === "undefined") return () => undefined;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    target.dataset.visible = "true";
    return () => undefined;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      target.dataset.visible = "true";
      observer.disconnect();
    },
    { threshold },
  );

  observer.observe(target);
  return () => observer.disconnect();
}

export function safeFadeIn(target: string | Element, duration = 0.6, y = 20) {
  return fadeInUp(target, { duration, y, ease: "power2.out" });
}

export function staggerCards(targets: string | Element[], delayStep = 0.08) {
  if (typeof window === "undefined") return null;
  return gsap.fromTo(
    targets,
    { opacity: 0, y: 16 },
    {
      opacity: 1,
      y: 0,
      duration: 0.45,
      ease: "power2.out",
      stagger: delayStep,
    },
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
  pipe: gsap.utils.pipe,
};
