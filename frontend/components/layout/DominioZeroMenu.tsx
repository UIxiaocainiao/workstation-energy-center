import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "@/hooks/useLocale";
import { BrandLogoMark } from "@/components/branding/BrandLogoMark";

type MenuKey = "home" | "about" | "login" | "register";

type MenuItem = {
  key: MenuKey;
  label: string;
  href: string;
  hoverImg: string;
  isActive?: (pathname: string) => boolean;
};

const HOVER_IMAGES = {
  home: "https://dominiozero.es/assets/img/menu/home.jpg",
  about: "https://dominiozero.es/assets/img/menu/about.jpg",
  auth: "https://dominiozero.es/assets/img/menu/about.jpg",
} as const;

const MENU_BASE = [
  {
    key: "home" as const,
    href: "/",
    hoverImg: HOVER_IMAGES.home,
    isActive: (pathname: string) => pathname === "/",
  },
  {
    key: "about" as const,
    href: "/about",
    hoverImg: HOVER_IMAGES.about,
  },
  {
    key: "login" as const,
    href: "/auth/login",
    hoverImg: HOVER_IMAGES.auth,
  },
  {
    key: "register" as const,
    href: "/auth/register",
    hoverImg: HOVER_IMAGES.auth,
  },
];

const MENU_LABELS: Record<"zh" | "en", Record<MenuKey, string>> = {
  zh: {
    home: "首页",
    about: "关于项目",
    login: "登录",
    register: "注册",
  },
  en: {
    home: "Home",
    about: "About",
    login: "Log In",
    register: "Sign Up",
  },
};

const COPY = {
  zh: {
    logoText: "工位补能站",
    goHome: "回到首页",
    logout: "退出",
    login: "登录",
    register: "注册",
    logoutSuccess: "已退出登录",
    logoutFailed: "退出失败，请稍后再试",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
    switchLanguage: "切换到英文",
  },
  en: {
    logoText: "Workstation Energy Center",
    goHome: "Go home",
    logout: "Log out",
    login: "Log In",
    register: "Sign Up",
    logoutSuccess: "Logged out",
    logoutFailed: "Logout failed, please try again",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    switchLanguage: "Switch to Chinese",
  },
} as const;

export function DominioZeroMenu() {
  const router = useRouter();
  const { user, isAuthenticated, isReady, logout } = useAuth();
  const { locale, toggleLocale } = useLocale();
  const headerRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLElement | null>(null);
  const previewImageRef = useRef<HTMLImageElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const copy = COPY[locale];
  const menuItems = useMemo<MenuItem[]>(
    () =>
      MENU_BASE.map((item) => ({
        ...item,
        label: MENU_LABELS[locale][item.key],
      })),
    [locale],
  );

  const activeItem = useMemo(
    () =>
      menuItems.find((item) => {
        if (item.isActive) return item.isActive(router.pathname);
        return router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
      }),
    [menuItems, router.pathname],
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

  async function onLogout() {
    try {
      await logout();
      toast.success(copy.logoutSuccess);
      await router.push("/");
    } catch {
      toast.error(copy.logoutFailed);
    }
  }

  return (
    <>
      <header ref={headerRef} className="dz-main-header">
        <Link href="/" className="dz-logo" aria-label={copy.goHome}>
          <BrandLogoMark className="dz-logo-mark" />
          <span className="dz-logo-text">{copy.logoText}</span>
        </Link>

        <div className="dz-menu">
          <div className="dz-auth-actions">
            <button type="button" className="dz-auth-link" onClick={toggleLocale} title={copy.switchLanguage}>
              {locale === "zh" ? "EN" : "中"}
            </button>
            {!isReady ? (
              <span className="dz-auth-placeholder">...</span>
            ) : isAuthenticated && user ? (
              <>
                <span className="dz-auth-user">{user.username}</span>
                <button type="button" className="dz-auth-link" onClick={() => void onLogout()}>
                  {copy.logout}
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="dz-auth-link">
                  {copy.login}
                </Link>
                <Link href="/auth/register" className="dz-auth-link dz-auth-link-primary">
                  {copy.register}
                </Link>
              </>
            )}
          </div>
          <button
            className="dz-menu-button"
            type="button"
            aria-label={isOpen ? copy.closeMenu : copy.openMenu}
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
