import DashToolbar, { FilterTabs } from "../../../../components/DashToolbar";

/** Search and the has-ordered filter for the customer list. */
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
