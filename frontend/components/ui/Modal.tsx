import type { PropsWithChildren } from "react";

export function Modal({ children, open }: PropsWithChildren<{ open: boolean }>) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="glass-card w-full max-w-lg p-6">{children}</div>
    </div>
  );
}
