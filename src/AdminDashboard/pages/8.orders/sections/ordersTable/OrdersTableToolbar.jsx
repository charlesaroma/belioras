/* Admin Dashboard Page: Orders - OrdersTableToolbar */
import DashListToolbar from "../../../../components/DashListToolbar";

export default function OrdersToolbar({ query, onQueryChange, tabs, status, onStatusChange, pageSize, onPageSizeChange }) {
  return (
    <DashListToolbar
      tabs={tabs}
      tab={status}
      onTabChange={onStatusChange}
      tabsLabel="Orders by status"
      query={query}
      onQueryChange={onQueryChange}
      placeholder="Search orders"
      pageSize={pageSize}
      onPageSizeChange={onPageSizeChange}
    />
  );
}
