import { useLocale } from "@/hooks/useLocale";

export function Footer() {
  const { isZh } = useLocale();

  return (
    <footer className="mt-20 border-t border-[var(--color-frost-border)] py-8 text-sm text-[var(--color-silver)]">
      <div className="container-page flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          {isZh
            ? "工位补能站 · 给每一个表面正常上班、实际全靠硬撑的人。"
            : "Workstation Energy Center · For everyone who looks fine at work but is running on pure willpower."}
        </div>
        <div>© 2026 Workstation Energy Center</div>
      </div>
    </footer>
  );
}
