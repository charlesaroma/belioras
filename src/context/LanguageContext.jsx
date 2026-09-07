/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo } from "react";

import { useLocalStorage } from "../hooks/useLocalStorage";
import { DEFAULT_LANGUAGE, isSupportedLanguage, locales, t as translate } from "../utils/i18n";
import { localeForLanguage } from "../utils/formatCurrency";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [stored, setLanguage] = useLocalStorage("belioras:language", DEFAULT_LANGUAGE);

  // A code persisted before a locale was retired would otherwise leave every
  // string falling back to English with no way back.
  const language = isSupportedLanguage(stored) ? stored : DEFAULT_LANGUAGE;

  const locale = localeForLanguage(language);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      locale,
      locales: locales(),
      t: (key, defaultText, values) => translate(key, defaultText, language, values),
    }),
    [language, setLanguage, locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
