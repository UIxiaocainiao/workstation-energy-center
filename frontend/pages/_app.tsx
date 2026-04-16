import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { AppProviders } from "@/components/AppProviders";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProviders>
      <Component {...pageProps} />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#f1f5f9",
            backdropFilter: "blur(12px)",
          },
        }}
      />
    </AppProviders>
  );
}
