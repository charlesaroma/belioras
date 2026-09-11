import { mockApi } from "@/api/mock";
import { getState } from "./contentStore";

/**
 * Dashboard-managed content.
 *
 * Reads use a zero delay rather than the usual 250ms: this is content the app
 * already holds in memory, not a network round trip, and the hero is the LCP
 * element — an artificial delay here shows as a blank first paint.
 */

export function getHeroSlides() {
  return mockApi(() => {
    const { slides, autoplayMs } = getState("hero");
    return { slides: slides.filter((slide) => slide.active !== false), autoplayMs };
  }, 0);
}

export function getInstagramPosts() {
  return mockApi(() => {
    const { posts, handle } = getState("instagram");
    return { posts, handle };
  }, 0);
}
