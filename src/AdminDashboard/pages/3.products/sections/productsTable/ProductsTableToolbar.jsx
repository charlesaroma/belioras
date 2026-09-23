/* Admin Dashboard Page: Products - ProductsTableToolbar */
import { Plus } from "lucide-react";

import Button from "../../../../../components/ui/Button";
import DashFilterChips from "../../../../components/DashFilterChips";
import DashFilters from "../../../../components/DashFilters";
import DashHeaderActions from "../../../../components/DashHeaderActions";
import DashTabs from "../../../../components/DashTabs";
import DashToolbar from "../../../../components/DashToolbar";
import PageSizeSelect from "../../../../components/PageSizeSelect";

/**
 * Three quiet rows rather than one crowded one: the status tabs across the
 * top, then search, Filters and "Show 20", then the filters that are on.
 * "Add product" is the page's main action, so it sits in the page header.
 */
export default function ProductsToolbar({
  query, onQueryChange, tabs, status, onStatusChange, groups, filters, onFiltersChange, pageSize, onPageSizeChange,
}) {
  return (
    <div className="shrink-0 space-y-4">
      <DashHeaderActions>
        <Button icon={Plus} size="sm" to="/dashboard/products/new" className="h-10">
          <span className="hidden sm:inline">Add product</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </DashHeaderActions>

      <DashTabs ariaLabel="Products by status" options={tabs} value={status} onChange={onStatusChange} />

      <DashToolbar query={query} onQueryChange={onQueryChange} placeholder="Search pieces">
        <PageSizeSelect value={pageSize} onChange={onPageSizeChange} />
        <DashFilters groups={groups} value={filters} onChange={onFiltersChange} />
      </DashToolbar>

      <DashFilterChips groups={groups} value={filters} onChange={onFiltersChange} />
    </div>
  );
}
