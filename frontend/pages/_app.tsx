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
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(214, 235, 253, 0.19)",
            color: "#f0f0f0",
            boxShadow: "rgba(176, 199, 217, 0.145) 0 0 0 1px",
            backdropFilter: "blur(12px)",
          },
        }}
      />
    </AppProviders>
  );
}
