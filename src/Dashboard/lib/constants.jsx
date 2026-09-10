
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

export const DASHBOARD_NAV_ITEMS = DASHBOARD_NAV_GROUPS.flatMap((group) => group.items);

export const PRODUCT_STATUS = {
  active: { label: "Active", tone: "positive" },
  draft: { label: "Draft", tone: "neutral" },
  out_of_stock: { label: "Out of stock", tone: "negative" },
};

export const STATUS_TONES = {
  positive: "bg-success/10 text-success",
  pending: "bg-gold-500/15 text-gold-800",
  progress: "bg-brown-50 text-brown-700",
  neutral: "bg-umber-50 text-espresso-soft",
  negative: "bg-error/10 text-error",
};
