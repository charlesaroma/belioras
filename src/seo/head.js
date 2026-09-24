/* SEO: applying a page's tags in the browser */
import { headTags } from "./seo";

/**
 * The address canonical links point at. The build writes the same value into
 * the static pages, so set VITE_SITE_URL once a custom domain is live; until
 * then the address the site is served from is the right one.
 */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/+$/, "");

/**
 * Replaces the page's SEO tags with `meta`'s. Every tag this writes, and every
 * one the static HTML shipped with, carries `data-seo`, so a page never keeps
 * the previous page's canonical or structured data.
 */
export function applyHead(meta) {
  document.head.querySelectorAll("[data-seo]").forEach((el) => el.remove());

  const fragment = document.createDocumentFragment();
  for (const { tag, attrs, text } of headTags(meta, SITE_URL)) {
    if (tag === "title") {
      document.title = text;
      continue;
    }
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
    if (text != null) el.textContent = text;
    el.setAttribute("data-seo", "");
    fragment.append(el);
  }
  document.head.append(fragment);
}
