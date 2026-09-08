/**
 * Dashboard navigation, in groups.
 *
 * Eight flat items is a list you scan; grouped, it is a structure you learn.
 * The three groups answer three different questions — what do we sell, what
 * is selling, and how is the shop set up — which is roughly how the day
 * divides.
 *
 * `capability` is what the signed-in person must hold to see the item. The
 * sidebar filters on it, and hides a whole group when nothing in it survives,
 * so staff are not shown headings over empty space. The route guard is the
 * real check; this only keeps the menu honest.
 */
export const DASHBOARD_NAV_GROUPS = [
  {
    id: "main",
    label: null,
    items: [{ id: "overview", label: "Overview", icon: "LayoutDashboard" }],
  },
  {
    id: "catalogue",
    label: "Catalogue",
    items: [
      { id: "products", label: "Products", icon: "Package", capability: "catalog" },
      { id: "categories", label: "Attributes", icon: "Tags", capability: "content" },
      { id: "mega-menu", label: "Mega Menu", icon: "Menu", capability: "content" },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    items: [
      { id: "orders", label: "Orders", icon: "ShoppingCart", capability: "orders" },
      // Customers and Team were one "Users" page listing shoppers and staff in
      // the same table, with a role dropdown on every row — the control that
      // grants administrator access sitting beside a customer's delivery
      // history. Different jobs, different audiences, different permissions.
      { id: "customers", label: "Customers", icon: "Users", capability: "orders" },
    ],
  },
  {
    id: "store",
    label: "Store",
    items: [
      { id: "team", label: "Team", icon: "ShieldCheck", capability: "team" },
      { id: "settings", label: "Settings", icon: "Settings", capability: "settings" },
    ],
  },
];

/** Flat list, for anything that needs to look an item up by id. */
export const DASHBOARD_NAV_ITEMS = DASHBOARD_NAV_GROUPS.flatMap((group) => group.items);

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
