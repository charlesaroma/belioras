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
  "cookie-policy", "whats-new",
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

/** A plain-language description: "Accessories › Heels", "Dresses · Party, Evening". */
export function describeTarget(target, { categories = [], taxonomy = {}, products = [] } = {}) {
  if (!target) return "Nothing chosen";
  const categoryName = (id) => categories.find((c) => c.id === id)?.name ?? id;
  const valueName = (dimension, id) =>
    taxonomy[dimension]?.values?.find((v) => v.id === id)?.name ?? id;

  let text;
  switch (target.kind) {
    case "all":
      text = "Everything in the shop";
      break;
    case "category":
      text = categoryName(target.id);
      break;
    case "type": {
      const type = categories.find((c) => c.id === target.category)?.types?.find((t) => t.id === target.id);
      text = `${categoryName(target.category)} › ${type?.name ?? target.id}`;
      break;
    }
    case "filter":
      text = (target.values ?? []).map((v) => valueName(target.dimension, v)).join(", ");
      break;
    case "label":
      text = LABELS[target.id] ?? target.id;
      break;
    case "product":
      text = products.find((p) => p.id === target.id)?.name ?? "A product that no longer exists";
      break;
    default:
      text = "Unknown";
  }

  const scope = [
    target.kind !== "category" && target.kind !== "type" && target.category ? categoryName(target.category) : null,
    target.newOnly && !(target.kind === "label" && target.id === "new") ? "new arrivals only" : null,
  ].filter(Boolean);

  return scope.length ? `${text} · ${scope.join(" · ")}` : text;
}

/** A sensible starting name for a link, which the admin may change. */
export function suggestLabel(target, lookups) {
  return describeTarget({ ...target, category: undefined, newOnly: undefined }, lookups);
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
