import promotionsSeed from "../data/promotions.json";

import { mockApi } from "./apiClient";

function isActive({ start, end } = {}) {
  const now = Date.now();
  return (!start || new Date(start).getTime() <= now) && (!end || new Date(end).getTime() >= now);
}

export function getPromotions() {
  return mockApi(() => JSON.parse(JSON.stringify(promotionsSeed)));
}

export function getTopBanner() {
  return mockApi(() => {
    const { topBanner, announcements } = promotionsSeed;
    return topBanner && isActive(topBanner)
      ? { ...topBanner, announcements }
      : null;
  });
}

export function getFlashSale() {
  return mockApi(() =>
    promotionsSeed.flashSale?.active && isActive(promotionsSeed.flashSale)
      ? { ...promotionsSeed.flashSale }
      : null
  );
}

export function getPopup() {
  return mockApi(() =>
    promotionsSeed.popup?.enabled ? { ...promotionsSeed.popup } : null
  );
}