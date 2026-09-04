"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { localeDirection, type Locale } from "@/lib/locale";
import { identities } from "@/lib/mock-data";
import { themeForIdentity, type IdentityId, type ThemeName } from "@/lib/theme";

type AppContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  identity: IdentityId | null;
  theme: ThemeName;
  selectIdentity: (identity: IdentityId | null) => void;
  toast: (message: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("fa");
  const [identity, setIdentity] = useState<IdentityId | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const theme = themeForIdentity(identity);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeDirection[locale];
    document.documentElement.dataset.identity = identity ?? "shared";
  }, [identity, locale]);

  const selectIdentity = useCallback((nextIdentity: IdentityId | null) => {
    setIdentity(nextIdentity);
  }, []);

  const toast = useCallback((message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(""), 2800);
  }, []);

  const value = useMemo(
    () => ({ locale, setLocale, identity, theme, selectIdentity, toast }),
    [identity, locale, selectIdentity, theme, toast],
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      <div className="toast" role="status" aria-live="polite" aria-atomic="true">
        {toastMessage && <span>{toastMessage}</span>}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}

export function useIdentityName() {
  const { identity, locale } = useApp();
  return identity ? identities[identity].name[locale] : locale === "fa" ? "هردوی ما" : "Both of us";
}
