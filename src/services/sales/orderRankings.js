import { mockApi } from "@/api/mock";
import { getState } from "../store/contentStore";
import { isOffTimeline } from "../../utils/orderStatus";

/**
 * Product ids ranked by units sold — the client's requirement that Best Sellers
 * "populate automatically based on client order data" rather than a manual flag.
 *
 * Orders that never completed are excluded; a real backend would compute this
 * as a rollup updated on order.paid rather than scanning on read.
 */

export function getBestSellerProductIds({ limit = 12, sinceDays = null } = {}) {
  return mockApi(() => {

    const cutoff = sinceDays ? Date.now() - sinceDays * 86400000 : null;

    const unitsByProduct = new Map();

    for (const order of getState("orders").items) {
      // Refunded orders were previously counted as sales, inflating the
      // ranking with pieces that came back.
      if (isOffTimeline(order.status)) continue;
      if (cutoff && new Date(order.createdAt).getTime() < cutoff) continue;

      for (const item of order.items ?? []) {
        if (!item.productId) continue;
        unitsByProduct.set(
          item.productId,
          (unitsByProduct.get(item.productId) ?? 0) + (item.quantity ?? 1),
        );
      }
    }

    return [...unitsByProduct.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([productId, units]) => ({ productId, units }));
  }, 0);
}

