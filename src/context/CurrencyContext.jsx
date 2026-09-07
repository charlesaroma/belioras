/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo } from "react";

import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  CURRENCY_SYMBOLS,
  SUPPORTED_CURRENCIES,
  convertFromBase,
  formatCurrency,
} from "../utils/formatCurrency";
import { useLanguage } from "./LanguageContext";

const CurrencyContext = createContext(null);

/** Must sit inside LanguageProvider — formatting is locale-dependent. */
export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useLocalStorage("belioras:currency", "EUR");
  const { locale } = useLanguage();

  /** Catalog prices are stored in EUR; this puts them in the active currency. */
  const convert = useCallback((amountInEur) => convertFromBase(amountInEur, currency), [currency]);

  /** Convert and format in one step — the call most components actually want. */
  const format = useCallback(
    (amountInEur) => formatCurrency(convertFromBase(amountInEur, currency), currency, locale),
    [currency, locale],
  );

  /**
   * Formats an amount that has already been converted. Needed where a value is
   * derived from converted arithmetic (free-shipping thresholds, progress bars)
   * and so must not be converted a second time.
   */
  const formatConverted = useCallback(
    (amount) => formatCurrency(amount, currency, locale),
    [currency, locale],
  );

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      convert,
      format,
      formatConverted,
      symbol: CURRENCY_SYMBOLS[currency] ?? currency,
      currencies: SUPPORTED_CURRENCIES,
    }),
    [currency, setCurrency, convert, format, formatConverted],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
