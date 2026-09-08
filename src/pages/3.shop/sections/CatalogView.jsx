import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { useAsyncData } from "../../../hooks/useAsyncData";
import { useContentVersion } from "../../../context/ContentContext";
import { useFilterParams } from "../../../hooks/useFilterParams";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { getTaxonomy } from "../../../services/navigationApi";
import { applyFilters, computeFacets, priceBounds, sortProducts } from "../../../utils/faceting";
import { DEFAULT_COLUMNS, isValidColumns } from "../../../utils/gridColumns";
import GridViewSwitcher from "../../../components/storefront/GridViewSwitcher";

import ActiveFilters from "./ActiveFilters";
import FilterPanel from "./FilterPanel";
import ProductGrid from "./ProductGrid";
import ShopHeader from "./ShopHeader";
import { SORT_OPTIONS } from "./constants";

/**
 * Catalog shell shared by /shop and every category route.
 *
 * Products arrive already scoped to the route — /shop supplies the whole
 * catalog, a category page supplies what the URL resolved to. Refinement below
 * that is identical either way and lives in the query string (see
 * useFilterParams), so a filtered view is shareable and the back button steps
 * through refinements instead of leaving the page.
 */
export default function CatalogView({ products, loading, error, header = {}, emptyState = null }) {
  const list = useMemo(() => products ?? [], [products]);

  const version = useContentVersion();
  const { data: taxonomy } = useAsyncData(getTaxonomy, [version]);
  const { filters, activeCount, toggleValue, setPrice, setSale, setSort, setQuery, clearAll } =
    useFilterParams();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [storedCols, setCols] = useLocalStorage("belioras:gridColumns", DEFAULT_COLUMNS);
  const cols = isValidColumns(storedCols) ? storedCols : DEFAULT_COLUMNS;

  const bounds = useMemo(() => priceBounds(list), [list]);
  const facets = useMemo(
    () => (taxonomy ? computeFacets(list, taxonomy, filters) : {}),
    [list, taxonomy, filters],
  );

  const searchActive = Boolean(filters.query);

  const filtered = useMemo(
    () => sortProducts(applyFilters(list, filters), filters.sort),
    [list, filters],
  );

  // A route with no stock at all is a different situation from filters that
  // exclude everything, and reads badly if both say the same thing.
  const routeIsEmpty = !loading && !error && list.length === 0;

  const panelProps = {
    facets,
    filters,
    priceBounds: bounds,
    activeCount,
    onToggle: toggleValue,
    onPriceChange: (value) => setPrice(value, bounds),
    onSaleChange: setSale,
    onClearAll: clearAll,
  };

  return (
    <div className="min-h-screen bg-ivory-50">
      <ShopHeader {...header} />

      <FilterPanel
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        resultCount={filtered.length}
        {...panelProps}
      />

      {routeIsEmpty && emptyState ? (
        emptyState
      ) : (
        <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-8 md:px-10">
          <div className="min-w-0">
              <div className="mb-5 flex flex-wrap items-center justify-end gap-3">
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="catalog-sort"
                    className="flex items-center gap-2 text-xs text-espresso-soft"
                  >
                    <span className="hidden uppercase tracking-widest sm:inline">Sort by</span>
                  </label>
                  <select
                    id="catalog-sort"
                    value={filters.sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="-ml-2 border border-umber-100 bg-transparent px-2 py-1.5 text-xs text-espresso outline-none transition-colors hover:border-espresso"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value ?? option} value={option.value ?? option}>
                        {option.label ?? option}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    aria-haspopup="dialog"
                    aria-expanded={drawerOpen}
                    className="relative inline-flex items-center gap-2 border border-espresso px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-espresso transition-colors hover:bg-espresso hover:text-ivory-50"
                  >
                    <SlidersHorizontal className="size-3.5" aria-hidden="true" />
                    Filter
                    {activeCount > 0 && (
                      <span className="flex size-4 items-center justify-center rounded-full bg-gold-500 text-[9px] font-bold leading-none text-espresso">
                        {activeCount}
                      </span>
                    )}
                  </button>

                  <GridViewSwitcher columns={cols} setColumns={setCols} />
                </div>
              </div>

              {(activeCount > 0 || searchActive) && (
                <div className="mb-6">
                  <ActiveFilters
                    facets={facets}
                    filters={filters}
                    onToggle={toggleValue}
                    onClearPrice={() => setPrice(bounds, bounds)}
                    onSaleChange={setSale}
                    onClearQuery={() => setQuery("")}
                    onClearAll={clearAll}
                  />
                </div>
              )}

              <ProductGrid
                filtered={filtered}
                cols={cols}
                loading={loading}
                error={error}
                onClearFilters={clearAll}
                hasActiveFilters={activeCount > 0}
              />
          </div>
        </div>
      )}
    </div>
  );
}
