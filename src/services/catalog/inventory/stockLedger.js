/* Stock Ledger */
import { getState, setState } from "../../store/contentStore";
import { ANY, withOnHand } from "./variants";

/** Why stock changed. Only these reach the history. */
export const REASONS = {
  received: "Received",
  adjusted: "Adjusted",
  counted: "Stock count",
  damaged: "Damaged or lost",
  sold: "Shipped to a customer",
  returned: "Returned to stock",
};

let sequence = 0;
const newId = () => `mv_${Date.now().toString(36)}_${(sequence += 1)}`;

/**
 * Applies stock changes to the products and writes each to the history, in
 * one step so the two cannot disagree.
 *
 * `changes`: `[{ productId, colorId, size, delta, reason, orderId?, note?, by? }]`.
 * A change of 0 is dropped. Returns the movements written.
 */
export function applyStockChanges(changes) {
  const real = changes.filter((c) => Number(c.delta) !== 0);
  if (!real.length) return [];

  const at = new Date().toISOString();
  const movements = [];
  const byId = new Map(getState("products").items.map((p) => [p.id, p]));

  for (const change of real) {
    const product = byId.get(change.productId);
    if (!product) continue;
    const colorId = change.colorId ?? ANY;
    const size = change.size ?? ANY;
    const { product: next, onHandAfter } = withOnHand(product, colorId, size, Number(change.delta));
    byId.set(product.id, next);
    movements.push({
      id: newId(),
      productId: product.id,
      colorId,
      size,
      delta: Number(change.delta),
      onHandAfter,
      reason: REASONS[change.reason] ? change.reason : "adjusted",
      orderId: change.orderId ?? null,
      note: change.note?.trim() || null,
      by: change.by ?? null,
      at,
    });
  }

  setState("products", (s) => ({ ...s, items: s.items.map((p) => byId.get(p.id) ?? p) }));
  setState("stockMovements", (s) => ({ ...s, items: [...movements, ...s.items] }));
  return movements;
}

/** Writes history rows without touching stock, for changes already applied (a product-form save). */
export function recordMovements(rows) {
  const at = new Date().toISOString();
  const movements = rows
    .filter((r) => Number(r.delta) !== 0)
    .map((r) => ({ id: newId(), orderId: null, note: null, by: null, ...r, at }));
  if (movements.length) setState("stockMovements", (s) => ({ ...s, items: [...movements, ...s.items] }));
  return movements;
}

/** History, newest first. A variant of "*" colour means the whole product. */
export function movementsFor(productId, colorId = ANY, size = ANY) {
  return getState("stockMovements").items.filter(
    (m) =>
      m.productId === productId &&
      (colorId === ANY || m.colorId === colorId || m.colorId === ANY) &&
      (size === ANY || m.size === size || m.size === ANY),
  );
}
