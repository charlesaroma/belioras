export const RATES = { EUR: 1, USD: 1.08, GBP: 0.86 };

const SYMBOLS = { EUR: "€", USD: "$", GBP: "£" };

export function convertAmount(amount, from = "EUR", to = "EUR") {
  if (from === to) return amount;
  return (amount * RATES[from]) / RATES[to];
}

export function formatCurrency(amount, currency = "EUR", locale = "en-IE") {
  const symbol = SYMBOLS[currency] || currency;
  return `${symbol}${Number(amount).toFixed(2)}`;
}