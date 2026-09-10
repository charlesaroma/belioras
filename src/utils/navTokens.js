/**
 * URL → filter-token resolution.
 *
 * Products are matched against a prefixed-tag vocabulary (cat:, len:, occ:,
 * style:, fabric:, color:, hair:, tag:) shared by the mega menu, the filter
 * drawer and the future dashboard. Tags are derived in productsApi rather than
 * stored, so no product JSON had to be rewritten to adopt this.
 *
 * Pure module — no data imports, so it stays trivially testable.
 */

/** Menu dimension → token prefix. */
const DIMENSION_PREFIX = {
  category: "cat",
  occasion: "occ",
  style: "style",
  fabric: "fabric",
  color: "color",
  length: "len",
  wigs: "hair",
  shoes: "cat",
  bags: "cat",
  jewelry: "cat",
};

/**
 * The client's "Shop by Category" section is not one dimension — it mixes
 * lengths (Mini Dresses), occasions (Prom & Gala, Formal Wear) and true
 * garment types (Jumpsuits). The original category logic was kept verbatim per
 * the design review, so the mixing is resolved here rather than by editing the
 * menu the client signed off on.
 *
 * Anything absent falls through to `cat:<value>`.
 */

/* CATEGORY ALIASES */
const CATEGORY_ALIASES = {
  "mini-dresses": { tokens: ["len:mini"], match: "all" },
  "midi-dresses": { tokens: ["len:midi"], match: "all" },
  "maxi-dresses": { tokens: ["len:maxi"], match: "all" },
  "prom-gala": { tokens: ["occ:prom", "occ:gala"], match: "any" },
  "formal-wear": { tokens: ["occ:formal"], match: "all" },
};

/** Colour leaves with no single swatch behind them. */
const COLOR_ALIASES = {
  monochrome: { tokens: ["color:black", "color:white"], match: "any" },
};

/**
 * Menu entries that deliberately span several values — "Mini, Midi & Maxi
 * Dresses" is one link covering three lengths, so it matches on `any`.
 */

/* GROUP TOKENS */
const GROUP_TOKENS = {
  "mini-midi-maxi": { tokens: ["len:mini", "len:midi", "len:maxi"], match: "any" },
  "party-evening": { tokens: ["occ:party", "occ:evening"], match: "any" },
  "formal-gala": { tokens: ["occ:formal", "occ:gala"], match: "any" },
  catalog: { tokens: ["tag:new"], match: "all" },
  collections: { tokens: ["tag:featured"], match: "all" },
};

/** Bare root landings. `shop` is everything, so it carries no token. */
const ROOT_TOKENS = {
  shop: [],
  dresses: ["cat:dresses"],
  hair: ["cat:hair"],
  accessories: ["cat:accessories"],
  "new-arrivals": ["tag:new"],
};

export function splitPath(pathname) {
  return pathname.split("/").filter(Boolean);
}

/**
 * Resolves a pathname into the tokens a product must carry to appear.
 *
 * Returns `null` for a shape this vocabulary cannot express; callers treat that
 * as a 404. Note that a resolvable *shape* is not the same as a valid path —
 * catalogApi additionally checks the path exists in the navigation tree, so
 * `/shop/color/chartreuse` resolves here but still 404s there.
 */

/* resolve Nav Path */
export function resolveNavPath(pathname) {

  const parts = splitPath(pathname);
  if (parts.length === 0) return null;

  const [root, ...rest] = parts;
  if (!(root in ROOT_TOKENS)) return null;

  // /shop, /hair — the unfiltered landing for a root.
  if (rest.length === 0) {
    return { root, tokens: ROOT_TOKENS[root], match: "all", dimension: "root", value: root };
  }

  // /dresses/mini-midi-maxi, /new-arrivals/catalog — a curated grouping.
  if (rest.length === 1) {

    const group = GROUP_TOKENS[rest[0]];
    if (!group) return null;
    return {
      root,
      tokens: [...ROOT_TOKENS[root], ...group.tokens],
      // A root token plus an `any` group cannot be expressed as one match mode,
      // so the root constraint is carried separately.
      baseTokens: ROOT_TOKENS[root],
      match: group.match,
      dimension: "group",
      value: rest[0],
    };
  }

  // /shop/occasion/party, /hair/wigs/straight — dimension + value.
  if (rest.length === 2) {
    const [dimension, value] = rest;

    const prefix = DIMENSION_PREFIX[dimension];
    if (!prefix) return null;

    const alias =
      (dimension === "category" && CATEGORY_ALIASES[value]) ||
      (dimension === "color" && COLOR_ALIASES[value]) ||
      null;

    const valueTokens = alias ? alias.tokens : [`${prefix}:${value}`];

    return {
      root,
      tokens: [...ROOT_TOKENS[root], ...valueTokens],
      baseTokens: ROOT_TOKENS[root],
      match: alias?.match ?? "all",
      dimension,
      value,
    };
  }

  return null;
}

/**
 * Tests a product's tags against a resolved path.
 *
 * `baseTokens` (the root constraint) always applies. The remaining tokens apply
 * with the resolved match mode, so "Mini, Midi & Maxi Dresses" means
 * "a dress AND (mini OR midi OR maxi)".
 */

/* matches Resolved */
export function matchesResolved(tags, resolved) {
  if (!resolved) return false;

  const tagSet = tags instanceof Set ? tags : new Set(tags);

  const base = resolved.baseTokens ?? [];
  if (!base.every((token) => tagSet.has(token))) return false;

  const rest = resolved.tokens.filter((token) => !base.includes(token));
  if (rest.length === 0) return true;

  return resolved.match === "any"
    ? rest.some((token) => tagSet.has(token))
    : rest.every((token) => tagSet.has(token));
}
