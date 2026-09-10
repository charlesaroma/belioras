import DashToolbar, { FilterTabs } from "../../../../components/DashToolbar";

/**
 * Search and the status filter for the order list.
 *
 * The tabs carry counts from the whole set, not the filtered one, so the page
 * computes them and hands them down.
 */
export default function OrdersToolbar({ query, onQueryChange, tabs, status, onStatusChange }) {
  return (
    <DashToolbar
      query={query}
      onQueryChange={onQueryChange}
      placeholder="Search by reference, name or email"
      filters={
        <FilterTabs
          ariaLabel="Filter by status"
          value={status}
          onChange={onStatusChange}
          options={tabs}
        />
      }
    />
  );
}
