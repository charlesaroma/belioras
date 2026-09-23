/* Admin Dashboard Page: Customers - CustomersTableToolbar */
import DashListToolbar from "../../../../components/DashListToolbar";

export default function CustomersToolbar({ query, onQueryChange, tabs, activity, onActivityChange, pageSize, onPageSizeChange }) {
  return (
    <DashListToolbar
      tabs={tabs}
      tab={activity}
      onTabChange={onActivityChange}
      tabsLabel="Customers by activity"
      query={query}
      onQueryChange={onQueryChange}
      placeholder="Search customers"
      pageSize={pageSize}
      onPageSizeChange={onPageSizeChange}
    />
  );
}
