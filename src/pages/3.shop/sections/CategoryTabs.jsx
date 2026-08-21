import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES, SORT_OPTIONS, COLOR_MAP } from "./constants";

function CategoryTabs({ 
  activeCategory, 
  setActiveCategory, 
  sortOrder, 
  setSortOrder, 
  setFilterPanelOpen,
  activeFilterCount, 
  filteredCount, 
  cols, 
  setCols,
  filters,
  updateFilters,
  onClearFilters
}) {
  return (
    <div className="sticky top-0 z-40 bg-ivory-50/95 backdrop-blur border-b border-umber-50/30">
      <div className="container-main px-4 sm:px-6 md:px-8 flex items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`cursor-pointer whitespace-nowrap px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all duration-200 rounded-full ${
                activeCategory === cat
                  ? "bg-espresso text-ivory-50"
                  : "text-espresso/60 hover:text-espresso"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:block text-[11px] text-espresso/50 font-medium">
            {filteredCount} items
          </span>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="cursor-pointer appearance-none bg-transparent border border-umber-50 rounded-full pl-3 pr-7 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-espresso focus:outline-none focus:border-espresso"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-espresso/50" />
          </div>

          {/* Filter toggle */}
          <button
            type="button"
            onClick={() => setFilterPanelOpen(true)}
            className="cursor-pointer relative flex items-center gap-2 px-4 py-1.5 rounded-full border border-umber-50 text-[11px] font-bold uppercase tracking-widest text-espresso hover:border-espresso transition-colors"
          >
            <SlidersHorizontal className="size-3.5" />
            Filter
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-gold-500 text-espresso text-[9px] font-bold flex items-center justify-center leading-none">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Grid size toggle (desktop) */}
          <div className="hidden lg:flex items-center gap-1 border border-umber-50 rounded-full px-2 py-1">
            {[3, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCols(n)}
                className={`cursor-pointer size-6 flex items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                  cols === n ? "bg-espresso text-ivory-50" : "text-espresso/40 hover:text-espresso"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active filter pills */}
      {(filters.colors.length > 0 || filters.style !== "All" || filters.onSale) && (
        <div className="container-main px-4 sm:px-6 md:px-8 pb-2 flex items-center gap-2 flex-wrap">
          {filters.colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => updateFilters({ colors: filters.colors.filter((x) => x !== c) })}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-espresso/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-espresso hover:bg-rose-50 hover:text-rose-700 transition-colors"
            >
              <span className="size-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: COLOR_MAP[c] ?? "#ccc" }} />
              {c}
              <X className="size-3" />
            </button>
          ))}
          {filters.style !== "All" && (
            <button
              type="button"
              onClick={() => updateFilters({ style: "All" })}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-espresso/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-espresso hover:bg-rose-50 hover:text-rose-700 transition-colors"
            >
              {filters.style} <X className="size-3" />
            </button>
          )}
          {filters.onSale && (
            <button
              type="button"
              onClick={() => updateFilters({ onSale: false })}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-gold-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-800 hover:bg-rose-50 hover:text-rose-700 transition-colors"
            >
              On Sale <X className="size-3" />
            </button>
          )}
          <button
            type="button"
            onClick={onClearFilters}
            className="cursor-pointer text-[10px] font-semibold uppercase tracking-wider text-espresso/60 hover:text-espresso transition-colors ml-2"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

export default CategoryTabs;