/* Orders And Stock */
import { getState } from "../../store/contentStore";
import { normalizeStatus } from "../../../utils/orderStatus";
import { colorIndex } from "../products/productColorways";
import { ANY, isHolding, isTracked, lineColorId, lineSize, onHandOf, reservedUnits, variantKey } from "./variants";

/**
 * What an order does to stock, Shopify's way:
 *
 *   placed (to pay / to ship)  holds the units: available drops, on hand does not
 *   shipped                    takes them off the shelf: on hand drops, once
 *   cancelled before shipping  nothing to undo; the hold simply ends
 *   cancelled / refunded after shipping
 *                              on hand rises again only if the pieces came back
 */

const ENDED = new Set(["cancelled", "refunded"]);

/** The variant an order line takes from, for this product. */
function variantOf(product, line, byName) {
  if (!isTracked(product)) return { colorId: ANY, size: ANY };
  return { colorId: lineColorId(line, byName), size: lineSize(line) };
}

/**
 * Lines asking for more than is available, as messages a shopper can act on.
 * Several lines for the same variant are added together.
 */
export function availabilityProblems(lines = []) {
  const products = new Map(getState("products").items.map((p) => [p.id, p]));
  const reserved = reservedUnits();
  const { byName, byId } = colorIndex();
  const wanted = new Map();

  for (const line of lines) {
    const product = products.get(line.productId);
    if (!product) continue;
    const { colorId, size } = variantOf(product, line, byName);
    const key = variantKey(product.id, colorId, size);
    const entry = wanted.get(key) ?? { product, colorId, size, qty: 0, line };
    entry.qty += Number(line.quantity) || 1;
    wanted.set(key, entry);
  }

  const problems = [];
  for (const [key, { product, colorId, size, qty, line }] of wanted) {
    const held = colorId === ANY ? (reserved.get(variantKey(product.id)) ?? 0) : (reserved.get(key) ?? 0);
    const available = Math.max(0, onHandOf(product, colorId, size) - held);
    if (qty <= available) continue;
    const where = [byId.get(colorId)?.name ?? line.color, size !== ANY && size !== "one-size" ? String(size).toUpperCase() : null]
      .filter(Boolean)
      .join(", ");
    problems.push(
      available === 0
        ? `${product.name}${where ? ` in ${where}` : ""} has just sold out.`
        : `Only ${available} left of ${product.name}${where ? ` in ${where}` : ""}.`,
    );
  }
  return problems;
}

/**
 * The stock changes a status change makes, and the fields to set on the
 * order so none is applied twice. `restock` says whether pieces from a
 * shipped order came back when it is cancelled or refunded.
 */
export function stockChangesForStatus(order, nextStatus, { restock = false, by = null } = {}) {
  const from = normalizeStatus(order.status);
  const to = normalizeStatus(nextStatus);
  const shipped = (s) => !isHolding(s) && !ENDED.has(s);
  const products = new Map(getState("products").items.map((p) => [p.id, p]));
  const { byName } = colorIndex();

  const linesAs = (sign, reason) =>
    (order.items ?? [])
      .filter((line) => products.has(line.productId))
      .map((line) => ({
        productId: line.productId,
        ...variantOf(products.get(line.productId), line, byName),
        delta: sign * (Number(line.quantity) || 1),
        reason,
        orderId: order.id,
        by,
      }));

  if (isHolding(from) && shipped(to) && !order.stockDeductedAt) {
    return { changes: linesAs(-1, "sold"), patch: { stockDeductedAt: new Date().toISOString() } };
  }
  if (shipped(from) && ENDED.has(to) && restock && !order.stockReturnedAt) {
    return { changes: linesAs(1, "returned"), patch: { stockReturnedAt: new Date().toISOString() } };
  }
  return { changes: [], patch: {} };
}

/** How many pieces a shipped order would put back, for the question asked before cancelling it. */
export function returnableUnits(order) {
  const status = normalizeStatus(order?.status);
  if (!order || isHolding(status) || ENDED.has(status) || order.stockReturnedAt) return 0;
  return (order.items ?? []).reduce((sum, line) => sum + (Number(line.quantity) || 1), 0);
}
