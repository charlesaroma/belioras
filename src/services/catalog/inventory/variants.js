/* Stock Variants */
import { getState, getVersion } from "../../store/contentStore";
import { normalizeStatus } from "../../../utils/orderStatus";
import { ONE_SIZE, colorIndex, colorwaysOf } from "../products/productColorways";

/**
 * One piece in one colour and size: the unit stock is counted in.
 *
 * On hand is stored on the product (`colorways[].stock[size]`, or one
 * `stock` number for a piece not yet counted per colour and size, whose
 * variant is "*" "*"). Reserved is never stored: it is the units in orders
 * not yet shipped, worked out from the orders themselves, so it cannot drift.
 * Available = on hand − reserved, and is what a shopper can buy.
 */

export const ANY = "*";

/** Orders whose pieces are promised but still on the shelf. */
const HOLDING = new Set(["to-pay", "to-ship"]);

export const variantKey = (productId, colorId = ANY, size = ANY) => `${productId}|${colorId}|${size}`;

export function isHolding(status) {
  return HOLDING.has(normalizeStatus(status));
}

/** Whether a product counts stock per colour and size. */
export function isTracked(product) {
  return colorwaysOf(product).some((w) => w.stock);
}

/** The colour id an order line refers to (lines carry the colour's name). */
export function lineColorId(line, byName = colorIndex().byName) {
  if (!line?.color) return ANY;
  return byName.get(String(line.color).toLowerCase())?.id ?? String(line.color);
}

export function lineSize(line) {
  return line?.size ? String(line.size).toLowerCase() : ONE_SIZE;
}

let cache = { version: -1, map: new Map() };

/**
 * Units held by orders not yet shipped, by variant and by product
 * (`variantKey(productId)` is the product's total). Recomputed only when the
 * store has changed.
 */
export function reservedUnits() {
  const version = getVersion();
  if (cache.version === version) return cache.map;
  const { byName } = colorIndex();
  const map = new Map();
  const add = (key, n) => map.set(key, (map.get(key) ?? 0) + n);
  for (const order of getState("orders").items) {
    if (!isHolding(order.status)) continue;
    for (const line of order.items ?? []) {
      if (!line.productId) continue;
      const qty = Number(line.quantity) || 1;
      add(variantKey(line.productId), qty);
      add(variantKey(line.productId, lineColorId(line, byName), lineSize(line)), qty);
    }
  }
  cache = { version, map };
  return map;
}

/** Units on the shelf for one variant. */
export function onHandOf(product, colorId = ANY, size = ANY) {
  if (colorId === ANY) {
    const ways = colorwaysOf(product);
    return isTracked(product)
      ? ways.reduce((sum, w) => sum + Object.values(w.stock ?? {}).reduce((a, n) => a + (Number(n) || 0), 0), 0)
      : Number(product.stock) || 0;
  }
  const way = colorwaysOf(product).find((w) => w.colorId === colorId);
  return Number(way?.stock?.[size]) || 0;
}

/**
 * The product with one variant's on hand changed by `delta`. A legacy piece
 * (one number) changes that number whatever colour or size is asked for.
 * Returns `{ product, onHandAfter }`; never below zero.
 */
export function withOnHand(product, colorId, size, delta) {
  if (!isTracked(product) || colorId === ANY) {
    const onHandAfter = Math.max(0, (Number(product.stock) || 0) + delta);
    return { product: { ...product, stock: onHandAfter }, onHandAfter };
  }
  let onHandAfter = 0;
  const colorways = colorwaysOf(product).map((w) => {
    if (w.colorId !== colorId) return w;
    onHandAfter = Math.max(0, (Number(w.stock?.[size]) || 0) + delta);
    return { ...w, stock: { ...(w.stock ?? {}), [size]: onHandAfter } };
  });
  const total = colorways.reduce((sum, w) => sum + Object.values(w.stock ?? {}).reduce((a, n) => a + (Number(n) || 0), 0), 0);
  return { product: { ...product, colorways, stock: total }, onHandAfter };
}
