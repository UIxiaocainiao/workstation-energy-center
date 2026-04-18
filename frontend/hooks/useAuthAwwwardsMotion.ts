import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/router";

export function useAuthAwwwardsMotion() {
  const rootRef = useRef<HTMLElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cleanupFns: Array<() => void> = [];

    const ctx = gsap.context(() => {
      gsap.set(".auth-aw__hero, .auth-aw__card", {
        transformPerspective: 1000,
        willChange: "transform, opacity",
      });

      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      intro
        .from(".auth-aw__hero", {
          autoAlpha: 0,
          y: 28,
          scale: 0.985,
          duration: 0.85,
        })
        .from(
          ".auth-aw__headline-line",
          {
            autoAlpha: 0,
            yPercent: 110,
            stagger: 0.07,
            duration: 0.72,
          },
          "<0.06",
        )
        .from(
          ".auth-aw__kicker, .auth-aw__description, .auth-aw__hero-foot",
          {
            autoAlpha: 0,
            y: 16,
            stagger: 0.06,
            duration: 0.52,
          },
          "<0.08",
        )
        .from(
          ".auth-aw__card",
          {
            autoAlpha: 0,
            x: 24,
            duration: 0.72,
          },
          "<0.05",
        )
        .from(
          ".auth-aw__topbar, .auth-aw__inline-note, .auth-aw__field, .auth-aw__checkbox, .auth-aw__primary, .auth-aw__aux, .auth-aw__divider, .auth-aw__social-btn, .auth-aw__links, .auth-aw__success > *",
          {
            autoAlpha: 0,
            y: 14,
            stagger: 0.042,
            duration: 0.42,
          },
          "<0.08",
        );

      const fields = root.querySelectorAll<HTMLElement>(".auth-aw__field");
      fields.forEach((field) => {
        const input = field.querySelector<HTMLInputElement>("input");
        if (!input) return;
        const onFocus = () => {
          gsap.to(field, { y: -2, duration: 0.2, ease: "power2.out" });
        };
        const onBlur = () => {
          gsap.to(field, { y: 0, duration: 0.24, ease: "power2.out" });
        };
        input.addEventListener("focus", onFocus);
        input.addEventListener("blur", onBlur);
        cleanupFns.push(() => {
          input.removeEventListener("focus", onFocus);
          input.removeEventListener("blur", onBlur);
        });
      });

    }, root);

    const onRouteStart = () => {
      gsap.to(root, {
        autoAlpha: 0,
        y: 12,
        duration: 0.24,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    };

    const onRouteDone = () => {
      gsap.fromTo(
        root,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.32, ease: "power2.out", overwrite: "auto" },
      );
    };

    router.events.on("routeChangeStart", onRouteStart);
    router.events.on("routeChangeComplete", onRouteDone);
    router.events.on("routeChangeError", onRouteDone);

    return () => {
      router.events.off("routeChangeStart", onRouteStart);
      router.events.off("routeChangeComplete", onRouteDone);
      router.events.off("routeChangeError", onRouteDone);
      cleanupFns.forEach((fn) => fn());
      ctx.revert();
    };
  }, [router.events]);

  return rootRef;
}
