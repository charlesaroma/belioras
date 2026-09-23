
/* DASHBOARD NAV GROUPS */
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
      // How many of each piece: on hand, held by open orders, and available.
      { id: "inventory", label: "Inventory", icon: "Warehouse", capability: "catalog" },
      { id: "categories", label: "Categories & Colours", icon: "Tags", capability: "content" },
      { id: "sizes", label: "Sizes & Guides", icon: "Ruler", capability: "content" },
      { id: "mega-menu", label: "Mega Menu", icon: "Menu", capability: "content" },
      { id: "reviews", label: "Reviews", icon: "Star", capability: "content" },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    items: [
      { id: "orders", label: "Orders", icon: "ShoppingCart", capability: "orders" },
      // The money behind orders: payments, refunds and failed attempts. A
      // separate page because one order can carry several of them.
      { id: "transactions", label: "Transactions", icon: "CreditCard", capability: "payments" },
      // Customers and Team were one "Users" page listing shoppers and staff in
      // the same table, with a role dropdown on every row — the control that
      // grants administrator access sitting beside a customer's delivery
      // history. Different jobs, different audiences, different permissions.
      { id: "customers", label: "Customers", icon: "Users", capability: "orders" },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    items: [
      { id: "discounts", label: "Discounts", icon: "Percent", capability: "marketing" },
      // Subscribers, campaigns and the welcome email for the Belioras Letter.
      { id: "newsletter", label: "Newsletter", icon: "Mail", capability: "marketing" },
    ],
  },
  {
    id: "store",
    label: "Store",
    items: [
      { id: "team", label: "Team", icon: "ShieldCheck", capability: "team" },
      { id: "shipping", label: "Shipping", icon: "Truck", capability: "settings" },
      { id: "settings", label: "Settings", icon: "Settings", capability: "settings" },
    ],
  },
];

/* DASHBOARD NAV ITEMS */
export const DASHBOARD_NAV_ITEMS = DASHBOARD_NAV_GROUPS.flatMap((group) => group.items);

/* PRODUCT STATUS */
export const PRODUCT_STATUS = {
  active: { label: "Active", tone: "positive" },
  draft: { label: "Draft", tone: "neutral" },
  out_of_stock: { label: "Out of stock", tone: "negative" },
};

/* STATUS TONES */
export const STATUS_TONES = {
  positive: "bg-success/10 text-success",
  pending: "bg-gold-500/15 text-gold-800",
  progress: "bg-brown-50 text-brown-700",
  neutral: "bg-umber-50 text-espresso-soft",
  negative: "bg-error/10 text-error",
};
