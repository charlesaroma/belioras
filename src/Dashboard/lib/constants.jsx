export const DASHBOARD_NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: "LayoutDashboard" },
  { id: "products", label: "Products", icon: "Package" },
  { id: "categories", label: "Categories", icon: "LayoutGrid" },
  { id: "orders", label: "Orders", icon: "ShoppingCart" },
  { id: "users", label: "Users", icon: "Users" },
  { id: "settings", label: "Settings", icon: "Settings" },
];

/**
 * Order lifecycle, re-exported from the canonical vocabulary.
 *
 * This used to be its own map, which is precisely how the codebase ended up
 * with three disagreeing status lists — and how `paid` came to be missing from
 * two of them, rendering a blank chip for orders that had been paid for.
 * src/utils/orderStatus.js is now the single definition, shared by the
 * dashboard, the account pages and the public tracker; alias resolution for
 * the legacy seed keys lives there too, in normalizeStatus.
 *
 * `tone` is a semantic name rather than a Tailwind class: these previously
 * carried literal bg-yellow/blue/purple values, which is how an admin area
 * ends up in a different palette from the storefront it administers.
 *
 * Import ORDER_STATUS from src/utils/orderStatus directly — it is deliberately
 * not re-exported here, so there is one import path and no second place for
 * the vocabulary to drift.
 */

export const PRODUCT_STATUS = {
  active: { label: "Active", tone: "positive" },
  draft: { label: "Draft", tone: "neutral" },
  out_of_stock: { label: "Out of stock", tone: "negative" },
};

/** Shared tone → class map, so every chip in the admin area matches. */
export const STATUS_TONES = {
  positive: "bg-success/10 text-success",
  pending: "bg-gold-500/15 text-gold-800",
  progress: "bg-brown-50 text-brown-700",
  neutral: "bg-umber-50 text-espresso-soft",
  negative: "bg-error/10 text-error",
};
