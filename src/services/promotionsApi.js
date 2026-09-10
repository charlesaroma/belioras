import promotionsSeed from "../data/promotions.json";

import { mockApi } from "./apiClient";

function isActive({ start, end } = {}) {

  const now = Date.now();
  return (!start || new Date(start).getTime() <= now) && (!end || new Date(end).getTime() >= now);
}

/* get Promotions */
export function getPromotions() {
  return mockApi(() => JSON.parse(JSON.stringify(promotionsSeed)));
}

/**
 * The scrolling announcements are evergreen store messaging and run on their
 * own schedule. They were previously returned only while the seasonal sale
 * banner was inside its date window, so the whole ticker silently vanished the
 * day that sale expired.
 */

/* get Top Banner */
export function getTopBanner() {
  return mockApi(() => {
    const { topBanner, announcements } = promotionsSeed;
    if (!announcements?.length) return null;
    return {
      announcements,
      promo: topBanner && isActive(topBanner) ? topBanner : null,
    };
  });
}

/* get Flash Sale */
export function getFlashSale() {
  return mockApi(() =>
    promotionsSeed.flashSale?.active && isActive(promotionsSeed.flashSale)
      ? { ...promotionsSeed.flashSale }
      : null
  );
}
