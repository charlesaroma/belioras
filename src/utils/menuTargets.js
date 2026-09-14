/* Menu Targets */
import { DIMENSION_PREFIX } from "./faceting";

/**
 * What a menu item, link or tile shows, independent of its address.
 *
 *   { kind: "all" }                                    everything
 *   { kind: "category", id }                           Dresses
 *   { kind: "type", category, id }                     Accessories › Heels
 *   { kind: "filter", dimension, values[], category? } Party or Evening dresses
 *   { kind: "label", id: "new" | "featured" | "sale" } New arrivals
 *   { kind: "product", id }                            one piece (tiles only)
 *
 * Any collection target may also carry `category` (only within that category)
 * and `newOnly` (only pieces marked New). The address is generated once and
 * stored beside the target, so renaming a link never breaks a shared URL.
 */

export const FILTER_DIMENSIONS = ["occasion", "fabric", "style", "length", "color", "hair"];

export const LABELS = {
  new: "New arrivals",
  featured: "Featured",
  sale: "On sale",
};

/** Addresses the storefront already uses, so a menu item may not take them. */
export const RESERVED_SLUGS = new Set([
  "product", "checkout", "account", "wishlist", "search", "login", "signup",
  "forgot-password", "atelier", "dashboard", "faq", "about-us", "contact-us",
  "order-tracking", "hair-length-guide", "shoe-size-guide", "privacy-policy",
  "terms-of-service", "shipping-policy", "return-and-refund-policy",
  "cookie-policy", "whats-new", "newsletter",
]);

export function matchesTarget(product, target) {
  if (!product || !target) return false;
  const tags = new Set(product.tags ?? []);

  if (target.category && !tags.has(`cat:${target.category}`)) return false;
  if (target.newOnly && !tags.has("tag:new")) return false;

  switch (target.kind) {
    case "all":
      return true;
    case "category":
      return tags.has(`cat:${target.id}`);
    case "type":
      return tags.has(`cat:${target.category}`) && tags.has(`type:${target.id}`);
    case "filter": {
      const prefix = DIMENSION_PREFIX[target.dimension] ?? target.dimension;
      return (target.values ?? []).some((value) => tags.has(`${prefix}:${value}`));
    }
    case "label":
      if (target.id === "sale") return Boolean(product.originalPrice && product.originalPrice > product.price);
      return tags.has(`tag:${target.id}`);
    case "product":
      return product.id === target.id;
    default:
      return false;
  }
}

/** Whether a target still points at something that exists. */
export function targetExists(target, { categories = [], taxonomy = {}, products = [] } = {}) {
  if (!target) return false;
  const category = (id) => categories.find((c) => c.id === id);
  if (target.category && !category(target.category)) return false;

  switch (target.kind) {
    case "all":
      return true;
    case "category":
      return Boolean(category(target.id));
    case "type":
      return Boolean(category(target.category)?.types?.some((t) => t.id === target.id));
    case "filter": {
      const known = new Set((taxonomy[target.dimension]?.values ?? []).map((v) => v.id));
      return (target.values ?? []).length > 0 && target.values.every((v) => known.has(v));
    }
    case "label":
      return target.id in LABELS;
    case "product":
      return products.some((p) => p.id === target.id);
    default:
      return false;
  }
}

/** A URL segment from a name, unique among `taken` and never a reserved address. */
export function menuSlug(name, taken = new Set(), { reserved = false } = {}) {
  const base =
    String(name ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "link";

  let slug = base;
  for (let n = 2; taken.has(slug) || (reserved && RESERVED_SLUGS.has(slug)); n += 1) slug = `${base}-${n}`;
  return slug;
}
