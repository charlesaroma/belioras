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
  { id: "new-arrivals", label: "New Arrivals", to: "/whats-new" },
  { id: "shop", label: "Shop", to: "/shop" },
  { id: "dresses", label: "Dresses", to: "/shop/dresses" },
  { id: "hair", label: "Hair", to: "/shop/hair" },
  { id: "accessories", label: "Accessories", to: "/shop/accessories" },
];

export const SALE_BADGE = {
  minDiscountPct: 10,
  label: (product) => {
    if (!product.originalPrice || product.originalPrice <= product.price) return null;
    const pct = Math.round((1 - product.price / product.originalPrice) * 100);
    return pct >= SALE_BADGE.minDiscountPct ? `Save ${pct}%` : null;
  },
};

export const DRESS_SIZES = ["0", "2", "4", "6", "8", "10", "12", "14"];