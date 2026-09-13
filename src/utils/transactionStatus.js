/* Transaction Status And Method */

/** Chip labels and tones for a transaction's display status. */
export const TRANSACTION_STATUS = {
  succeeded: { label: "Succeeded", tone: "positive" },
  pending: { label: "Pending", tone: "pending" },
  failed: { label: "Failed", tone: "negative" },
  refunded: { label: "Refunded", tone: "neutral" },
  "partially-refunded": { label: "Part refunded", tone: "progress" },
};

export const TRANSACTION_TYPE = { charge: "Payment", refund: "Refund" };

const BRANDS = { visa: "Visa", mastercard: "Mastercard", amex: "Amex" };

/**
 * How the customer paid, as a person reads it: "Visa •• 4242", "Apple Pay ·
 * Mastercard •• 3222", "PayPal". Only the brand and last four digits are ever
 * held; the card number stays with the payment provider.
 */
export function describeMethod(method) {
  if (!method) return "—";
  const card = method.last4 ? `${BRANDS[method.brand] ?? method.brand} •• ${method.last4}` : null;
  if (method.type === "card") return card ?? "Card";
  if (method.type === "apple_pay") return card ? `Apple Pay · ${card}` : "Apple Pay";
  if (method.type === "paypal") return "PayPal";
  if (method.type === "klarna") return "Klarna";
  return method.type;
}

/**
 * Money in the currency it was charged in. A financial record is not converted
 * to the viewer's display currency the way a shop price is: what matters is
 * what the provider actually took.
 */
export function formatCharged(amount, currency, locale) {
  return new Intl.NumberFormat(locale, { style: "currency", currency: currency ?? "EUR" }).format(
    amount ?? 0,
  );
}
