import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/blackwords", label: "黑话翻译器" },
  { href: "/comfort", label: "今日补能" },
  { href: "/about", label: "关于项目" }
];

export function Header() {
  const router = useRouter();

  return (
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
              className={clsx(
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
  );
}
