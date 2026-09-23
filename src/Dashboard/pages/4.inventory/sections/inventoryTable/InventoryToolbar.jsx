/* Admin Dashboard Page: Inventory - InventoryToolbar */
import { Download, PackagePlus, X } from "lucide-react";

import Button from "@/components/ui/Button";
import DashFilterChips from "@/Dashboard/components/DashFilterChips";
import DashFilters from "@/Dashboard/components/DashFilters";
import DashHeaderActions from "@/Dashboard/components/DashHeaderActions";
import DashTabs from "@/Dashboard/components/DashTabs";
import DashToolbar from "@/Dashboard/components/DashToolbar";
import PageSizeSelect from "@/Dashboard/components/PageSizeSelect";

/** The same three quiet rows as Products, plus a bar for what is selected. */
export default function InventoryToolbar({ list, pageSize, onPageSizeChange, selected, onReceive, onClearSelection, onExport }) {
  return (
    <div className="shrink-0 space-y-4">
      <DashHeaderActions>
        <Button icon={Download} size="sm" variant="secondary" onClick={onExport} className="h-10">
          <span className="hidden sm:inline">Export CSV</span>
          <span className="sm:hidden">CSV</span>
        </Button>
      </DashHeaderActions>

      <DashTabs ariaLabel="Variants by stock" options={list.tabs} value={list.level} onChange={list.setLevel} />

      <DashToolbar query={list.query} onQueryChange={list.setQuery} placeholder="Search pieces or colours">
        <PageSizeSelect value={pageSize} onChange={onPageSizeChange} />
        <DashFilters groups={list.groups} value={list.filters} onChange={list.setFilters} />
      </DashToolbar>

      <DashFilterChips groups={list.groups} value={list.filters} onChange={list.setFilters} />

      {selected > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border border-espresso bg-espresso px-4 py-2.5 text-ivory-50">
          <p className="text-[12px] uppercase tracking-[0.14em]">{selected} selected</p>
          <div className="flex items-center gap-2">
            <Button icon={PackagePlus} size="sm" onClick={onReceive} className="h-9 bg-gold-400 text-espresso hover:bg-gold-300">
              Receive stock
            </Button>
            <button type="button" onClick={onClearSelection} aria-label="Clear selection" className="flex size-9 items-center justify-center text-ivory-50/70 hover:text-ivory-50">
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
