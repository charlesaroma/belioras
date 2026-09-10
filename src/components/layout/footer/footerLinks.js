/* Footer Link Columns */

// One definition per column. The footer previously wrote each list's markup
// twice, once per breakpoint, so a link added to one appeared on only half
// the site's widths.
export const FOOTER_COLUMNS = [
  {
    id: "shop",
    title: "Shop",
    // Filled from the live navigation tree at render, plus this fixed head.
    dynamic: "categories",
    links: [{ label: "What's New", to: "/whats-new" }],
  },
  {
    id: "support",
    title: "Support",
    links: [
      { label: "FAQ", to: "/faq" },
      { label: "Contact", to: "/contact-us" },
      { label: "Order Tracking", to: "/order-tracking" },
      { label: "Returns & Refunds", to: "/return-and-refund-policy" },
      { label: "Shipping Policy", to: "/shipping-policy" },
    ],
  },
  {
    id: "company",
    title: "Company",
    links: [
      { label: "About Us", to: "/about-us" },
      { label: "Hair Length Guide", to: "/hair-length-guide" },
      { label: "Shoe Size Guide", to: "/shoe-size-guide" },
    ],
  },
  {
    id: "legal",
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Terms of Service", to: "/terms-of-service" },
      { label: "Cookie Policy", to: "/cookie-policy" },
    ],
  },
];

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Resolves a column's links, folding in the live navigation where it asks.
// Nav labels are stored uppercase for the header; the footer sets its own
// case, so they are normalised rather than sitting in caps beside "What's New".
export function linksFor(column, categories) {
  if (column.dynamic !== "categories") return column.links;
  return [
    ...column.links,
    ...(categories ?? []).map((c) => ({ label: titleCase(c.label), to: `/${c.id}` })),
  ];
}

function titleCase(label) {
  return label.toLowerCase().replace(/(^|\s|&\s)([a-z])/g, (m) => m.toUpperCase());
}
