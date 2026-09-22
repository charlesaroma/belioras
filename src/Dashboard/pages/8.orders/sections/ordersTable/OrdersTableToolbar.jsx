/* Admin Dashboard Page: Orders - OrdersTableToolbar */
import DashToolbar, { FilterTabs } from "../../../../components/DashToolbar";

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
