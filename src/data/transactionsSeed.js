import transactions from "./transactions.json";

/**
 * Payments and refunds, wrapped as a revisioned collection.
 *
 * Sample data, not a record of real money. Each row mirrors the backend's
 * Payment table (provider, providerRef, status, amount, currency, method) plus
 * the three fields that table still lacks: `type`, so a refund is its own row;
 * `fee`, so net is knowable; and `failureReason`, so a declined payment can be
 * followed up. Amounts are major units in the currency charged, like orders.
 */
export default {
  rev: 2,
  items: transactions,
};
