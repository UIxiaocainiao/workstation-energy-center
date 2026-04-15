import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import clsx from "clsx";

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ variant = "primary", className, children, ...props }: Props) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition",
        {
          "bg-brand-500 text-white hover:bg-brand-600": variant === "primary",
          "bg-white/10 text-white hover:bg-white/15": variant === "secondary",
          "text-slate-300 hover:bg-white/5": variant === "ghost"
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
