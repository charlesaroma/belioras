/* Page: Shop - FilterPanel */

import ShopFilterDrawer from "./shopFilters/ShopFilterDrawer";
import ShopFilterSection from "./shopFilters/ShopFilterSection";
import ShopFilterPrice from "./shopFilters/ShopFilterPrice";
import { ShopFilterCheckbox } from "./shopFilters/ShopFilterCheckbox";

export default function FilterPanel({
  open,
  onClose,
  facets,
  filters,
  priceBounds,
  activeCount,
  resultCount,
  onToggle,
  onPriceChange,
  onSaleChange,
  onClearAll,
}) {

  const dimensions = Object.values(facets ?? {});

  return (
    <ShopFilterDrawer
      open={open}
      onClose={onClose}
      title="Filter"
      side="left"
      width="max-w-sm"
      footer={
        <div className="px-6 py-4">
          <button type="button" onClick={onClose} className="btn btn-md btn-primary w-full">
            Show {resultCount} {resultCount === 1 ? "piece" : "pieces"}
          </button>
        </div>
      }
    >
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between py-4">
          <span className="text-[11px] uppercase tracking-[0.22em] text-espresso-soft">
            {activeCount} active
          </span>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-[11px] uppercase tracking-widest text-gold-700 transition-colors hover:text-espresso"
            >
              Clear all
            </button>
          )}
        </div>

        {dimensions.map((facet, i) => (
          <ShopFilterSection
            key={facet.id}
            title={facet.label}
            defaultOpen={i === 0}
            selectedCount={(filters.dimensions[facet.id] ?? []).length}
          >
            {/* Two columns: the prototype's choice, and it roughly halves the
                scrolling on dimensions with a dozen values. */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {/*
                Values that would return nothing are removed upstream by
                computeFacets rather than shown greyed out. With counts hidden
                there is no way to explain a disabled row, so an unexplained
                inert option is worse than simply not offering it — and a
                shopper still cannot reach an empty grid either way.
              */}
              {facet.values.map((value) => {

                const selected = (filters.dimensions[facet.id] ?? []).includes(value.id);

                return (
                  <ShopFilterCheckbox
                    key={value.id}
                    checked={selected}
                    onChange={() => onToggle(facet.id, value.id)}
                    label={
                      value.hex ? (
                        <span className="inline-flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className="size-3 shrink-0 rounded-full border border-umber-100"
                            style={{ backgroundColor: value.hex }}
                          />
                          {value.name}
                        </span>
                      ) : (
                        value.name
                      )
                    }
                  />
                );
              })}
            </div>
          </ShopFilterSection>
        ))}

        <ShopFilterPrice
          bounds={priceBounds}
          filters={filters}
          onPriceChange={onPriceChange}
          onSaleChange={onSaleChange}
        />
      </div>
    </ShopFilterDrawer>
  );
}
