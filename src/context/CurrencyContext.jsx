import { createContext, useCallback, useContext, useMemo } from "react";

import { useLocalStorage } from "../hooks/useLocalStorage";
import { RATES } from "../utils/formatCurrency";

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useLocalStorage("belioras:currency", "EUR");

  const convert = useCallback((amountInEur) => amountInEur * RATES[currency], [currency]);

  const value = useMemo(() => ({ currency, setCurrency, convert }), [currency, setCurrency, convert]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}