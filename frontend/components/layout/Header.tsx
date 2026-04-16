import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "首页", icon: "🏠" },
  { href: "/blackwords", label: "黑话翻译器", icon: "🔄" },
  { href: "/comfort", label: "今日补能", icon: "⚡" },
  { href: "/about", label: "关于项目", icon: "💡" },
];

export function Header() {
  const router = useRouter();

  return (
    <>
      {/* Desktop top navigation */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-white">
            工位补能站
          </Link>
          <nav className="hidden gap-2 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm transition",
                  router.pathname === item.href
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/5"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile bottom navigation (NAV-04) */}
      <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-slate-950/90 backdrop-blur md:hidden">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[3.5rem] flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs transition",
                router.pathname === item.href
                  ? "text-brand-500"
                  : "text-slate-400 active:text-slate-200"
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
