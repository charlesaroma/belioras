import { useLocalStorage } from "../../hooks/useLocalStorage";

/**
 * A list's rows-per-page choice, remembered per list. Held by the page, which
 * hands it to both its toolbar's "Show" menu and its DashTable, so the two can
 * never disagree.
 */
export function usePageSize(tableId, fallback = 20) {
  return useLocalStorage(`belioras:dash:pageSize:${tableId}`, fallback);
}
