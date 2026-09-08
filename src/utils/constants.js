export const COLOR_HEX = {
  Ebony: "#120700",
  "Jet Black": "#120700",
  "Natural Black": "#1C1917",
  "Dark Brown": "#3F290E",
  Chestnut: "#734B1A",
  Caramel: "#9A7E48",
  "Honey Blonde": "#D9B166",
  Platinum: "#E6CB98",
  Champagne: "#F2D680",
  Sand: "#E6CB98",
  Ivory: "#FBF7F0",
  Blush: "#F3D7CF",
  Rosewood: "#8F6F48",
  Burgundy: "#7A4E35",
  Forest: "#166534",
  Slate: "#5B6472",
  Silver: "#C0C0C0",
  White: "#FFFFFF",
  Gold: "#D9B166",
};

export const NAV_LINKS = [
  { id: "new-arrivals", label: "New Arrivals", to: "/new-arrivals" },
  { id: "shop", label: "Shop", to: "/shop" },
  { id: "dresses", label: "Dresses", to: "/dresses" },
  { id: "hair", label: "Hair", to: "/hair" },
  { id: "accessories", label: "Accessories", to: "/accessories" },
];

/**
 * The catalog predates the dimensioned taxonomy and carries a flat
 * `categories[]` of ten values. These map each onto the token vocabulary so the
 * mega menu resolves against existing products without rewriting the fixtures.
 *
 * Once products carry real `tags[]`, this map and the derivation in
 * productsApi.normalize() can both be deleted.
 */
export const LEGACY_CATEGORY_TOKENS = {
  midi: "len:midi",
  maxi: "len:maxi",
  mini: "len:mini",
  evening: "occ:evening",
  everyday: "occ:everyday",
  straight: "hair:straight",
  wavy: "hair:wavy",
  bags: "cat:bags",
  scarves: "cat:scarves",
  belts: "cat:belts",
  jewelry: "cat:jewelry",
};

/**
 * Catalog colours are display names ("Ebony", "Champagne"); the taxonomy keys
 * on swatch ids. This maps one to the other so `/shop/color/black` matches.
 */
export const COLOR_NAME_TO_TAXONOMY = {
  Ebony: "black",
  "Jet Black": "black",
  "Natural Black": "black",
  "Dark Brown": "brown",
  Chestnut: "brown",
  Caramel: "brown",
  Rosewood: "brown",
  "Honey Blonde": "metallic",
  Platinum: "metallic",
  Silver: "metallic",
  Gold: "metallic",
  Champagne: "metallic",
  Sand: "white",
  Ivory: "white",
  White: "white",
  Blush: "pink",
  Burgundy: "burgundy",
  Forest: "green",
  Slate: "blue",
};

export const SALE_BADGE = {
  minDiscountPct: 10,
  label: (product) => {
    if (!product.originalPrice || product.originalPrice <= product.price) return null;
    const pct = Math.round((1 - product.price / product.originalPrice) * 100);
    return pct >= SALE_BADGE.minDiscountPct ? `Save ${pct}%` : null;
  },
};

export const DRESS_SIZES = ["0", "2", "4", "6", "8", "10", "12", "14"];
/**
 * The only two mailboxes Belioras actually operates.
 *
 * The repo previously wrote to eight invented addresses (care@, privacy@,
 * returns@, hello@, contact@, compliance@, clientcare@), none of which
 * receive mail. That mattered beyond tidiness: the privacy policy offered
 * privacy@ for GDPR access and erasure requests, and the GPSR block named
 * compliance@ as the responsible person — both legally required to be
 * reachable, both bouncing.
 *
 * The split is by intent, so a shopper can route themselves:
 *   SUPPORT — anything about an order: tracking, returns, shipping, sizing.
 *   GENERAL — anything about the company: press, privacy, GPSR, legal.
 *
 * These mirror settings.contact, which is the dashboard-editable copy. Use
 * these constants in static page copy; read settings.contact where the value
 * should follow what Belioras sets in the dashboard.
 */
export const CONTACT_EMAIL = {
  general: "info@belioras.com",
  support: "support@belioras.com",
};
