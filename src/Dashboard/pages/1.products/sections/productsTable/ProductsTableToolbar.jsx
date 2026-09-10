/* Admin Dashboard Page: Products - ProductsTableToolbar */
import { Plus } from "lucide-react";

import Button from "../../../../../components/ui/Button";
import DashToolbar, { FilterTabs } from "../../../../components/DashToolbar";

export default function ProductsToolbar({ query, onQueryChange, tabs, status, onStatusChange }) {
  return (
    <DashToolbar
      query={query}
      onQueryChange={onQueryChange}
      placeholder="Search by name, slug, category or colour"
      filters={
        <FilterTabs
          ariaLabel="Filter by status"
          value={status}
          onChange={onStatusChange}
          options={tabs}
        />
      }
    >
      <Button icon={Plus} to="/dashboard/products/new">
        Add product
      </Button>
    </DashToolbar>
  );
}
