import { useMemo, useState } from "react";

import { useUrlFilters } from "../../../../lib/useUrlFilters";
import { FILTER_KEYS, applyFilters, filterGroups } from "./productsTableFilters";
import { statusTabs } from "./productsTableRows";

/**
 * What the product list shows: search, status tab and filters.
 *
 * Filters and the tab live in the address, so a filtered view can be
 * bookmarked. The page filters and hands the table the rest; search, sort and
 * paging are the table's job. Tab counts follow the other filters, so they add up.
 */
export function useProductsList(rows, { categories, colors, format }) {
  const [query, setQuery] = useState("");
  const { filters, setFilters, values, setValue } = useUrlFilters(FILTER_KEYS, { status: "all" });
  const status = values.status;

  const groups = useMemo(
    () => filterGroups(rows, { categories: categories ?? [], colors: colors ?? [], format }),
    [rows, categories, colors, format],
  );
  const filtered = useMemo(() => applyFilters(rows, filters), [rows, filters]);
  const visible = useMemo(
    () => (status === "all" ? filtered : filtered.filter((p) => p.status === status)),
    [filtered, status],
  );
  const tabs = useMemo(() => statusTabs(filtered), [filtered]);

  return {
    query,
    setQuery,
    status,
    setStatus: (s) => setValue("status", s),
    groups,
    filters,
    setFilters,
    visible,
    tabs,
    filtering: Boolean(query) || status !== "all" || Object.values(filters).some((v) => v.length),
  };
}
