/* Inventory API */
import { ApiError, mockApi } from "@/api/mock";
import { DEFAULT_LOW_STOCK, stockLevel, thresholdFor } from "../../../utils/stockLevel";
import { getState, setState } from "../../store/contentStore";
import { colorIndex, colorwaysOf } from "../products/productColorways";
import { applyStockChanges, movementsFor, REASONS } from "./stockLedger";
import { ANY, isTracked, onHandOf, reservedUnits, variantKey } from "./variants";

export { REASONS };

/** The shop-wide low-stock line; a product may set its own. */
export function lowStockThreshold() {
  const value = getState("settings").inventory?.lowStockThreshold;
  return Number.isFinite(value) ? value : DEFAULT_LOW_STOCK;
}

/**
 * One row per variant: a piece in one colour and size, with what is on the
 * shelf, what open orders hold, and what is left to sell.
 */
export function getInventory() {
  return mockApi(() => {
    const reserved = reservedUnits();
    const { byId } = colorIndex();
    const shop = lowStockThreshold();
    const rows = [];

    for (const product of getState("products").items) {
      const base = {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price) || 0,
        cost: Number(product.costPrice) || 0,
        collectionId: product.collectionId,
        threshold: thresholdFor(product, shop),
      };
      const push = (colorId, size, image, held) => {
        const onHand = onHandOf(product, colorId, size);
        const available = Math.max(0, onHand - held);
        const color = byId.get(colorId);
        rows.push({
          ...base,
          id: variantKey(product.id, colorId, size),
          colorId,
          colorName: colorId === ANY ? null : (color?.name ?? colorId),
          hex: color?.hex ?? null,
          size,
          image,
          onHand,
          reserved: held,
          available,
          level: stockLevel(available, base.threshold),
        });
      };

      if (!isTracked(product)) {
        push(ANY, ANY, product.images?.[0] ?? null, reserved.get(variantKey(product.id)) ?? 0);
        continue;
      }
      for (const way of colorwaysOf(product)) {
        const image = way.images?.[0] ?? product.images?.[0] ?? null;
        for (const size of Object.keys(way.stock ?? {})) {
          push(way.colorId, size, image, reserved.get(variantKey(product.id, way.colorId, size)) ?? 0);
        }
      }
    }
    return rows;
  });
}

/**
 * Changes one variant's on hand. `mode` is "add", "remove" or "set". On hand
 * may not drop below what open orders already hold: those pieces are promised.
 */
export function adjustStock({ productId, colorId = ANY, size = ANY, mode, quantity, reason, note, by }) {
  return mockApi(() => {
    const product = getState("products").items.find((p) => p.id === productId);
    if (!product) throw new ApiError("That piece no longer exists.", 404);
    const qty = Math.floor(Number(quantity));
    if (!Number.isFinite(qty) || qty < 0 || (mode !== "set" && qty === 0)) {
      throw new ApiError("Enter how many pieces, as a whole number.", 422);
    }
    const before = onHandOf(product, colorId, size);
    const after = mode === "set" ? qty : mode === "remove" ? before - qty : before + qty;
    const reservedMap = reservedUnits();
    const held = colorId === ANY ? (reservedMap.get(variantKey(productId)) ?? 0) : (reservedMap.get(variantKey(productId, colorId, size)) ?? 0);
    if (after < held) {
      throw new ApiError(`${held} ${held === 1 ? "is" : "are"} held by open orders, so on hand can't go below ${held}.`, 409);
    }
    if (after === before) throw new ApiError("That leaves the count unchanged.", 422);
    const [movement] = applyStockChanges([{ productId, colorId, size, delta: after - before, reason, note, by }]);
    return movement;
  });
}

/** "Receive stock" for several variants at once: the same number added to each. */
export function receiveStock(variantIds, quantity, { reason = "received", note, by } = {}) {
  return mockApi(() => {
    const qty = Math.floor(Number(quantity));
    if (!(qty > 0)) throw new ApiError("Enter how many pieces arrived, as a whole number.", 422);
    const changes = variantIds.map((id) => {
      const [productId, colorId, size] = id.split("|");
      return { productId, colorId, size, delta: qty, reason, note, by };
    });
    return applyStockChanges(changes);
  });
}

/** One variant's history, newest first. */
export function getStockHistory(productId, colorId = ANY, size = ANY) {
  return mockApi(() => movementsFor(productId, colorId, size).map((m) => ({ ...m })), 0);
}

export function getLowStockThreshold() {
  return mockApi(() => lowStockThreshold(), 0);
}

export function setLowStockThreshold(value) {
  return mockApi(() => {
    const n = Math.floor(Number(value));
    if (!Number.isFinite(n) || n < 0 || n > 999) throw new ApiError("Enter a whole number from 0 to 999.", 422);
    setState("settings", (s) => ({ ...s, inventory: { ...(s.inventory ?? {}), lowStockThreshold: n } }));
    return n;
  });
}
