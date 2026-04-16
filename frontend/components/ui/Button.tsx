import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
};

export function Button({
  variant = "primary",
  size = "default",
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-[var(--color-frost-border)] font-medium text-[var(--color-near-white)] transition disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-transparent hover:bg-white/[0.28]": variant === "primary",
          "border-white bg-white text-black hover:bg-white/90": variant === "secondary",
          "rounded-md border-transparent text-white/70 hover:bg-white/[0.06] hover:text-[var(--color-near-white)]": variant === "ghost",
        },
        {
          "px-3 py-1.5 text-sm": size === "default",
          "px-2.5 py-1 text-xs": size === "sm",
          "px-5 py-2.5 text-base": size === "lg",
          "size-9 p-0": size === "icon",
        },
        variant !== "ghost" && "shadow-[0_0_0_1px_var(--color-frost-ring)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
