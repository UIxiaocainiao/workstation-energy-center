import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "首页", icon: "🏠" },
  { href: "/about", label: "关于项目", icon: "💡" },
];

export function Header() {
  const router = useRouter();

  return (
    <>
      {/* Desktop top navigation */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-frost-border)] bg-black/85 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/" className="text-lg font-medium section-title text-[var(--color-near-white)]">
            工位补能站
          </Link>
          <nav className="hidden gap-2 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "nav-link rounded-full border border-transparent px-3 py-2 transition",
                  router.pathname === item.href
                    ? "border-[var(--color-frost-border)] bg-white/[0.08] text-[var(--color-near-white)]"
                    : "text-white/70 hover:bg-white/[0.04]"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile bottom navigation (NAV-04) */}
      <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-frost-border)] bg-black/90 backdrop-blur md:hidden">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[3.5rem] flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs transition",
                router.pathname === item.href
                  ? "text-brand-500"
                  : "text-white/60 active:text-white/80"
              )}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
