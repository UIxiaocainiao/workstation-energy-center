import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

export type Locale = "zh" | "en";

type LocaleContextValue = {
  locale: Locale;
  isZh: boolean;
  toggleLocale: () => void;
  setLocale: (next: Locale) => void;
};

const STORAGE_KEY = "wec_locale";

const LocaleContext = createContext<LocaleContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return value === "zh" || value === "en";
}

export function LocaleProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<Locale>("zh");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const cached = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(cached)) {
      setLocaleState(cached);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      isZh: locale === "zh",
      setLocale: (next) => setLocaleState(next),
      toggleLocale: () => setLocaleState((prev) => (prev === "zh" ? "en" : "zh")),
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
