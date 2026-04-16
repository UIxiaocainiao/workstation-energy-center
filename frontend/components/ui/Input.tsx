import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-md border border-[var(--color-frost-border)] bg-white/[0.02] px-4 py-3 text-sm text-[var(--color-near-white)] placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-500",
        props.className
      )}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-32 w-full rounded-md border border-[var(--color-frost-border)] bg-white/[0.02] px-4 py-3 text-sm text-[var(--color-near-white)] placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-500",
        props.className
      )}
    />
  );
}
