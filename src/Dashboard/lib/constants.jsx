export const DASHBOARD_NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: "LayoutDashboard" },
  { id: "products", label: "Products", icon: "Package" },
  { id: "categories", label: "Categories", icon: "LayoutGrid" },
  { id: "orders", label: "Orders", icon: "ShoppingCart" },
  { id: "users", label: "Users", icon: "Users" },
  { id: "settings", label: "Settings", icon: "Settings" },
];

/**
 * Order lifecycle.
 *
 * Includes the four stages agreed for the customer dashboard — To pay, To
 * ship, Shipped, To review — alongside the legacy keys still present in the
 * seed data, so both render while the data migrates.
 *
 * `tone` is a semantic name rather than a Tailwind class: these previously
 * carried literal bg-yellow/blue/purple values, which is how an admin area
 * ends up in a different palette from the storefront it administers.
 */
export const ORDER_STATUS = {
  "to-pay": { label: "To pay", tone: "pending" },
  "to-ship": { label: "To ship", tone: "progress" },
  shipped: { label: "Shipped", tone: "progress" },
  "to-review": { label: "To review", tone: "positive" },
  reviewed: { label: "Reviewed", tone: "positive" },

  // Legacy keys from the seed fixtures.
  pending: { label: "Pending", tone: "pending" },
  processing: { label: "Processing", tone: "progress" },
  delivered: { label: "Delivered", tone: "positive" },
  cancelled: { label: "Cancelled", tone: "negative" },
  refunded: { label: "Refunded", tone: "neutral" },
};

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
