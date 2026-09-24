import promotionsSeed from "../../data/promotions.json";

import { mockApi } from "@/api/mock";
import { getState } from "../store/contentStore";

function isActive({ start, end } = {}) {

  const now = Date.now();
  return (!start || new Date(start).getTime() <= now) && (!end || new Date(end).getTime() >= now);
}

export function getPromotions() {
  return mockApi(() => JSON.parse(JSON.stringify(promotionsSeed)));
}

/**
 * The scrolling announcements, as the dashboard's Settings edits them: each
 * message has its own on/off switch and optional dates, and only those live
 * today are shown. Evergreen store messaging runs on its own schedule; the
 * seasonal sale banner's window has no say over it.
 */

export function getTopBanner() {
  return mockApi(() => {
    const { topBanner } = promotionsSeed;
    const announcements = (getState("settings").announcements ?? []).filter(
      (m) => m.active && String(m.text ?? "").trim() && isActive({ start: m.start, end: m.end ? `${m.end.slice(0, 10)}T23:59:59Z` : "" }),
    );
    if (!announcements.length) return null;
    return {
      announcements,
      promo: topBanner && isActive(topBanner) ? topBanner : null,
    };
  });
}
