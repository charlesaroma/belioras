import { useMemo, useState } from "react";

/**
 * Search, filter, sort and paginate a list, in that order.
 *
 * Shared because all four admin list pages need exactly this and would
 * otherwise each grow their own copy — which is how the pages ended up with
 * four different column definitions and three different chip renderers.
 *
 * Sorting and filtering run over the whole set before the page is sliced, so
 * "sort by price" means the cheapest item in the catalogue, not the cheapest
 * on the page you happen to be looking at.
 */
export default function useDashList(
  items,
  { searchKeys = ["name"], filterKey = null, pageSize = 25, initialSort = null } = {},
) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = items ?? [];

    if (filterKey && filter !== "all") {
      rows = rows.filter((row) => row[filterKey] === filter);
    }

    if (q) {
      rows = rows.filter((row) =>
        searchKeys.some((key) => {
          const value = row[key];
          const text = Array.isArray(value) ? value.join(" ") : value;
          return String(text ?? "").toLowerCase().includes(q);
        }),
      );
    }

    if (sort?.key) {
      const dir = sort.direction === "desc" ? -1 : 1;
      rows = [...rows].sort((a, b) => {
        const av = a[sort.key];
        const bv = b[sort.key];
        // Numbers compare numerically; everything else compares as text with
        // locale rules, so "Écru" files next to "Ecru" rather than after "Z".
        if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
        return String(av ?? "").localeCompare(String(bv ?? ""), undefined, { numeric: true }) * dir;
      });
    }

    return rows;
  }, [items, query, filter, filterKey, searchKeys, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  // Clamp during render rather than in an effect. Narrowing a search while on
  // page 4 would otherwise show an empty table for one frame before a state
  // update corrected it.
  const safePage = Math.min(page, pageCount);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const reset = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  return {
    query,
    setQuery: reset(setQuery),
    filter,
    setFilter: reset(setFilter),
    sort,
    setSort: reset(setSort),
    page: safePage,
    setPage,
    pageCount,
    total: filtered.length,
    rows: paged,
    allFiltered: filtered,
  };
}
