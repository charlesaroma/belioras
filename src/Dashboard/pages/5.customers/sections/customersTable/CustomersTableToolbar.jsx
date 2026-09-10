/* Admin Dashboard Page: Customers - CustomersTableToolbar */
import DashToolbar, { FilterTabs } from "../../../../components/DashToolbar";

export default function CustomersToolbar({ query, onQueryChange, tabs, activity, onActivityChange }) {
  return (
    <DashToolbar
      query={query}
      onQueryChange={onQueryChange}
      placeholder="Search customers by name or email"
      filters={
        <FilterTabs
          ariaLabel="Filter by activity"
          value={activity}
          onChange={onActivityChange}
          options={tabs}
        />
      }
    />
  );
}
