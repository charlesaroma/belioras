import { mockApi } from "@/api/mock";
import { getState } from "./contentStore";
import { flattenLeaves } from "./navigationApi";
import { getProducts } from "./productsApi";
import { matchesResolved, resolveNavPath, splitPath } from "../utils/navTokens";

/**
 * The catalog page's single data source.
 *
 * Path validity is derived from the same navigation tree the mega menu is built
 * from, which is what guarantees the two can never disagree: a leaf in the menu
 * always resolves, and an invented path always 404s.
 */

function findNavMatch(pathname) {

  const path = pathname.replace(/\/+$/, "");

  const slug = path.replace(/^\//, "");
  const { items } = getState("navigation");

  const root = items.find((item) => item.slug === slug);
  if (root) {
    return { label: root.label, breadcrumb: [{ label: root.label, url: root.url }], root };
  }

  for (const leaf of flattenLeaves(items)) {
    if (leaf.slug !== slug) continue;

    const parent = items.find((item) => item.id === leaf.rootId);
    return {
      label: leaf.label,
      breadcrumb: [
        { label: parent?.label ?? leaf.rootLabel, url: parent?.url ?? `/${leaf.rootId}` },
        { label: leaf.label, url: leaf.url },
      ],
      root: parent,
      leaf,
    };
  }

  return null;
}

/**
 * Resolves a pathname to its products.
 *
 * `valid: false` means the caller should render a 404 — the path is not in the
 * navigation tree, whatever shape it happens to have.
 */

export function getCatalog(pathname) {
  return mockApi(async () => {

    const navMatch = findNavMatch(pathname);

    const resolved = resolveNavPath(pathname);

    if (!navMatch || !resolved) {
      return { valid: false, resolved: null, products: [], total: 0 };
    }

    const all = await getProducts();

    const products = all.filter((product) => matchesResolved(product.tags, resolved));

    return {
      valid: true,
      resolved: {
        label: navMatch.label,
        breadcrumb: navMatch.breadcrumb,
        dimension: resolved.dimension,
        value: resolved.value,
        root: resolved.root,
        rootUrl: navMatch.root?.url ?? `/${resolved.root}`,
        rootLabel: navMatch.root?.label ?? resolved.root,
      },
      products,
      total: products.length,
    };
  }, 0);
}

/** Sibling leaves under the same section — the chips shown above the grid. */
export function getSiblingLeaves(pathname) {
  return mockApi(() => {

    const slug = pathname.replace(/^\//, "").replace(/\/+$/, "");
    const { items } = getState("navigation");

    for (const root of items) {
      for (const section of root.sections) {
        if (section.items.some((leaf) => leaf.slug === slug)) return section.items;
      }
    }

    // A root landing: offer the first section's leaves as an entry point.
    const rootMatch = items.find((item) => item.slug === splitPath(pathname)[0]);
    return rootMatch?.sections?.[0]?.items ?? [];
  }, 0);
}
