/* Admin Dashboard Page: Products - ProductsTableToolbar */
import { Plus } from "lucide-react";

import Button from "../../../../../components/ui/Button";
import DashFilterChips from "../../../../components/DashFilterChips";
import DashFilters from "../../../../components/DashFilters";
import DashToolbar, { FilterTabs } from "../../../../components/DashToolbar";

export default function ProductsToolbar({ query, onQueryChange, tabs, status, onStatusChange, groups, filters, onFiltersChange }) {
  return (
    <div className="shrink-0 space-y-3">
      <DashToolbar
        query={query}
        onQueryChange={onQueryChange}
        placeholder="Search by name, slug, category or colour"
        filters={
          <>
            <FilterTabs ariaLabel="Filter by status" value={status} onChange={onStatusChange} options={tabs} />
            <DashFilters groups={groups} value={filters} onChange={onFiltersChange} />
          </>
        }
      >
        <Button icon={Plus} to="/dashboard/products/new">
          Add product
        </Button>
      </DashToolbar>
      <DashFilterChips groups={groups} value={filters} onChange={onFiltersChange} />
    </div>
  );
}
