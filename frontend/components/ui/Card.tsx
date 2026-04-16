import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type CardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("glass-card p-5", className)} {...props}>
      {children}
    </div>
  );
}
