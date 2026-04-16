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
        "inline-flex items-center justify-center rounded-xl font-medium transition disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-brand-500 text-white hover:bg-brand-600": variant === "primary",
          "bg-white/10 text-white hover:bg-white/15": variant === "secondary",
          "text-slate-300 hover:bg-white/5": variant === "ghost",
        },
        {
          "px-4 py-2 text-sm": size === "default",
          "px-3 py-1.5 text-xs": size === "sm",
          "px-6 py-3 text-base": size === "lg",
          "size-9 p-0": size === "icon",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
