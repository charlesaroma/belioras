import { useMemo, useState } from "react";

import { useUrlFilters } from "../../../lib/useUrlFilters";
import { FILTER_KEYS, applyFilters, filterGroups, levelTabs } from "./inventoryRows";

/** What the inventory list shows: search, stock tab and filters, kept in the address. */
export function useInventoryList(rows, { categories, taxonomy }) {
  const [query, setQuery] = useState("");
  const { filters, setFilters, values, setValue } = useUrlFilters(FILTER_KEYS, { level: "all" });
  const level = values.level;

  const groups = useMemo(() => filterGroups(rows, { categories: categories ?? [], taxonomy }), [rows, categories, taxonomy]);
  // Tab counts follow the filters but not the tab itself.
  const filtered = useMemo(() => applyFilters(rows, filters, "all"), [rows, filters]);
  const visible = useMemo(() => (level === "all" ? filtered : filtered.filter((r) => r.level === level)), [filtered, level]);
  const tabs = useMemo(() => levelTabs(filtered), [filtered]);

  return {
    query,
    setQuery,
    level,
    setLevel: (l) => setValue("level", l),
    groups,
    filters,
    setFilters,
    visible,
    tabs,
    filtering: Boolean(query) || level !== "all" || Object.values(filters).some((v) => v.length),
  };
}
