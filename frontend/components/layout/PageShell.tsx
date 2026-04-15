import type { PropsWithChildren } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function PageShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-full">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
