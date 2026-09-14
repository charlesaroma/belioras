import { mockApi } from "@/api/mock";
import { getState } from "./contentStore";
import { flattenLeaves } from "./navigationApi";
import { getProducts } from "./productsApi";
import { matchesTarget } from "../utils/menuTargets";

/**
 * The catalog page's single data source.
 *
 * A path is valid only when it belongs to a menu item or link in the
 * navigation tree, and its products are whatever that item's target selects.
 * The menu and the pages it links to therefore cannot disagree: a link in the
 * menu always resolves, and an invented path always 404s.
 */

function findNavMatch(pathname) {
  const slug = pathname.replace(/\/+$/, "").replace(/^\//, "");
  const { items } = getState("navigation");

  const root = items.find((item) => item.slug === slug);
  if (root) {
    return { node: root, root, breadcrumb: [{ label: root.label, url: root.url }] };
  }

  for (const leaf of flattenLeaves(items)) {
    if (leaf.slug !== slug) continue;
    const parent = items.find((item) => item.id === leaf.rootId);
    return {
      node: leaf,
      root: parent,
      breadcrumb: [
        { label: parent?.label ?? leaf.rootLabel, url: parent?.url ?? `/${leaf.rootId}` },
        { label: leaf.label, url: leaf.url },
      ],
    };
  }

  return null;
}

/**
 * Resolves a pathname to its products.
 *
 * `valid: false` means the caller should render a 404: the path is not in the
 * navigation tree, or its item no longer says what it shows.
 */
export function getCatalog(pathname) {
  return mockApi(async () => {
    const match = findNavMatch(pathname);
    if (!match?.node?.target) {
      return { valid: false, resolved: null, products: [], total: 0 };
    }

    const all = await getProducts();
    const products = all.filter((product) => matchesTarget(product, match.node.target));

    return {
      valid: true,
      resolved: {
        label: match.node.label,
        breadcrumb: match.breadcrumb,
        target: match.node.target,
        rootUrl: match.root?.url ?? "/shop",
        rootLabel: match.root?.label ?? "Shop",
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
    const rootMatch = items.find((item) => item.slug === slug.split("/")[0]);
    return rootMatch?.sections?.[0]?.items ?? [];
  }, 0);
}
