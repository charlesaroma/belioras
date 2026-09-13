/* NAV LINKS */
export const NAV_LINKS = [
  // `label` is the English fallback; `key` is what t() looks up, so the
  // primary navigation follows the language selector like everything else.
  { id: "new-arrivals", key: "nav.newArrivals", label: "New Arrivals", to: "/new-arrivals" },
  { id: "shop", key: "nav.shop", label: "Shop", to: "/shop" },
  { id: "dresses", key: "nav.dresses", label: "Dresses", to: "/dresses" },
  { id: "hair", key: "nav.hair", label: "Hair", to: "/hair" },
  { id: "accessories", key: "nav.accessories", label: "Accessories", to: "/accessories" },
];

/**
 * The catalog predates the dimensioned taxonomy and carries a flat
 * `categories[]` of ten values. These map each onto the token vocabulary so the
 * mega menu resolves against existing products without rewriting the fixtures.
 *
 * Once products carry real `tags[]`, this map and the derivation in
 * productsApi.normalize() can both be deleted.
 */

/* LEGACY CATEGORY TOKENS */
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

/* SALE BADGE */
export const SALE_BADGE = {
  minDiscountPct: 10,
  label: (product) => {
    if (!product.originalPrice || product.originalPrice <= product.price) return null;

    const pct = Math.round((1 - product.price / product.originalPrice) * 100);
    return pct >= SALE_BADGE.minDiscountPct ? `Save ${pct}%` : null;
  },
};

/* DRESS SIZES */
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

/* CONTACT EMAIL */
export const CONTACT_EMAIL = {
  general: "info@belioras.com",
  support: "support@belioras.com",
};
