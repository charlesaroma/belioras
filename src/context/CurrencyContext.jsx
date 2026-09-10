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

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useLocalStorage("belioras:currency", "EUR");
  const { locale } = useLanguage();

  const convert = useCallback((amountInEur) => convertFromBase(amountInEur, currency), [currency]);

  const format = useCallback(
    (amountInEur) => formatCurrency(convertFromBase(amountInEur, currency), currency, locale),
    [currency, locale],
  );

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
