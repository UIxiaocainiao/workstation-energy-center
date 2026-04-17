import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

type MenuItem = {
  label: string;
  href: string;
  hoverImg: string;
  isActive?: (pathname: string) => boolean;
};

const HOVER_IMAGES = {
  home: "https://dominiozero.es/assets/img/menu/home.jpg",
  about: "https://dominiozero.es/assets/img/menu/about.jpg",
  work: "https://dominiozero.es/assets/img/menu/work.jpg",
  services: "https://dominiozero.es/assets/img/menu/servicios.jpg",
} as const;

const menuItems: MenuItem[] = [
  {
    label: "首页",
    href: "/",
    hoverImg: HOVER_IMAGES.home,
    isActive: (pathname) => pathname === "/",
  },
  {
    label: "黑话翻译器",
    href: "/blackwords",
    hoverImg: HOVER_IMAGES.work,
  },
  {
    label: "今日补能",
    href: "/comfort",
    hoverImg: HOVER_IMAGES.services,
  },
  {
    label: "关于项目",
    href: "/about",
    hoverImg: HOVER_IMAGES.about,
  },
];

export function DominioZeroMenu() {
  const router = useRouter();
  const headerRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLElement | null>(null);
  const previewImageRef = useRef<HTMLImageElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const activeItem = useMemo(
    () =>
      menuItems.find((item) => {
        if (item.isActive) return item.isActive(router.pathname);
        return router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
      }),
    [router.pathname],
  );

  const [previewImage, setPreviewImage] = useState(activeItem?.hoverImg ?? HOVER_IMAGES.home);

  const setPreviewImageSmooth = useCallback((nextSrc: string) => {
    const previewNode = previewImageRef.current;
    if (!previewNode) {
      setPreviewImage(nextSrc);
      return;
    }

    const currentSrc = previewNode.getAttribute("src") ?? "";
    if (currentSrc === nextSrc) return;

    const tempImage = new Image();
    tempImage.src = nextSrc;
    tempImage.onload = () => {
      setPreviewImage(nextSrc);
    };
  }, []);

  useEffect(() => {
    setPreviewImageSmooth(activeItem?.hoverImg ?? HOVER_IMAGES.home);
  }, [activeItem?.hoverImg, setPreviewImageSmooth]);

  useEffect(() => {
    const header = headerRef.current;
    const menu = menuRef.current;
    if (!header || !menu) return;

    const menuItemLabels = menu.querySelectorAll<HTMLElement>(".dz-menu-item-label");
    const previewNode = previewImageRef.current;

    gsap.set(menuItemLabels, { y: 400 });
    gsap.set(previewNode, { y: 1000 });
    gsap.set(menu, {
      display: "none",
      opacity: 1,
      clipPath: "polygon(0px 0px, 100% 0px, 100% 0px, 0px 0px)",
    });

    const timeline = gsap.timeline({
      paused: true,
      onReverseComplete: () => {
        gsap.set(menu, { display: "none" });
        header.style.mixBlendMode = "difference";
      },
    });

    timeline
      .add(gsap.to(menu, { display: "grid", immediateRender: false, duration: 0 }))
      .add(
        gsap.to(menu, {
          clipPath: "polygon(0px 0px, 100% 0px, 100% 100%, 0px 100%)",
          duration: 0.78,
          ease: "power3.out",
        }),
      )
      .add(
        gsap.to(previewNode, {
          y: 0,
          duration: 0.75,
          ease: "power2.out",
        }),
        "<0.08",
      )
      .add(gsap.to(header, { mixBlendMode: "unset", duration: 0.2 }), "<")
      .add(gsap.to(menuItemLabels, { y: 0, stagger: 0.06, delay: 0.1, duration: 0.52, ease: "power3.out" }), "<");

    timelineRef.current = timeline;
    return () => {
      timeline.kill();
      timelineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    const timeline = timelineRef.current;
    if (!header || !timeline) return;

    header.classList.toggle("nav-open", isOpen);
    document.documentElement.classList.toggle("dz-nav-open", isOpen);

    if (isOpen) {
      timeline.play();
      return;
    }

    timeline.reverse();
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [router.pathname]);

  useEffect(() => {
    const node = previewImageRef.current;
    if (!node || !isOpen) return;
    gsap.fromTo(node, { scale: 1 }, { scale: 1.05, duration: 0.35, ease: "power2.out" });
  }, [previewImage, isOpen]);

  return (
    <>
      <header ref={headerRef} className="dz-main-header">
        <Link href="/" className="dz-logo" aria-label="Go Home">
          工位补能站
        </Link>

        <div className="dz-menu">
          <button
            className="dz-menu-button"
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
          >
            <div className="dz-menu-button-icon" aria-hidden="true">
              <div className="line" />
              <div className="line" />
            </div>
          </button>
        </div>
      </header>

      <nav
        ref={menuRef}
        className="dz-nav-menu"
        aria-hidden={!isOpen}
        onMouseLeave={() => setPreviewImageSmooth(activeItem?.hoverImg ?? HOVER_IMAGES.home)}
      >
        <div className="left">
          <div className="dz-left-inner">
            <div className="dz-main-nav-list">
              {menuItems.map((item) => {
                const isActive = item.isActive
                  ? item.isActive(router.pathname)
                  : router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`dz-menu-item ${isActive ? "active" : ""}`}
                    onMouseEnter={() => setPreviewImageSmooth(item.hoverImg)}
                  >
                    <span className="dz-menu-item-label">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="right">
          <img ref={previewImageRef} src={previewImage} alt="" />
        </div>
      </nav>
    </>
  );
}
