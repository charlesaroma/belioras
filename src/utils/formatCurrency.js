/**
 * Currency conversion and formatting.
 *
 * EUR is the base currency: every price in the catalog is stored in EUR and
 * converted at display time. RATES are expressed as *units of the target
 * currency per 1 EUR*, so converting away from the base multiplies.
 */

export const RATES = { EUR: 1, USD: 1.08, GBP: 0.86 };

/** Trigger glyphs for the currency selector. Formatting uses Intl, not these. */
export const CURRENCY_SYMBOLS = { EUR: "€", USD: "$", GBP: "£" };

/* SUPPORTED CURRENCIES */
export const SUPPORTED_CURRENCIES = ["EUR", "USD", "GBP"];

/** Maps a UI language to the BCP-47 locale used for number formatting. */
const LOCALE_BY_LANGUAGE = {
  en: "en-GB",
  fr: "fr-FR",
  de: "de-DE",
  es: "es-ES",
  it: "it-IT",
  zh: "zh-Hans",
};

export function localeForLanguage(language) {
  return LOCALE_BY_LANGUAGE[language] ?? LOCALE_BY_LANGUAGE.en;
}

/** Converts an amount held in the base currency (EUR) into `to`. */
export function convertFromBase(amountInEur, to = "EUR") {
  return amountInEur * (RATES[to] ?? 1);
}

/**
 * Converts between two arbitrary currencies by routing through the base.
 * Dividing by the source rate normalises to EUR first; multiplying by the
 * target rate then leaves the value in `to`.
 */

export function convertAmount(amount, from = "EUR", to = "EUR") {
  if (from === to) return amount;
  return (amount / (RATES[from] ?? 1)) * (RATES[to] ?? 1);
}

/**
 * Intl.NumberFormat instances are expensive to construct and this runs once
 * per product card, so they are cached for the lifetime of the page.
 */

const formatterCache = new Map();

function getFormatter(locale, currency) {

  const key = `${locale}|${currency}`;
  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    formatterCache.set(key, formatter);
  }
  return formatter;
}

/**
 * Formats an amount already expressed in `currency`.
 *
 * Output is locale-correct rather than uniform: a French shopper sees
 * "290,00 €" where an English one sees "€290.00". That is intentional, and
 * differs from the static mockups.
 */

export function formatCurrency(amount, currency = "EUR", locale = "en-GB") {
  return getFormatter(locale, currency).format(Number(amount) || 0);
}
