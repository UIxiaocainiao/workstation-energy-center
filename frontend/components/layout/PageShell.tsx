import type { PropsWithChildren } from "react";
import { Footer } from "./Footer";

export function PageShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-full">
      <main>{children}</main>
      <Footer />
    </div>
  );
}
