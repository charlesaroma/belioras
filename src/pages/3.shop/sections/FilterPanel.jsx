import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, X } from "lucide-react";

import PriceRangeSlider from "./PriceRangeSlider";
import { cn } from "../../../utils/cn";

/**
 * Faceted filter panel, generated from the taxonomy rather than hardcoded.
 *
 * The previous version filtered on four fixed dimensions while taxonomy.json
 * carried seven and sixty-four values — so a dimension added in the dashboard
 * could never reach the storefront. Everything here comes from the facets it
 * is handed, which means new attributes appear with no code change.
 *
 * One component, two chromes: a persistent rail on desktop (hiding filters
 * behind a button on a large grid suppresses their use) and a drawer below lg.
 */
export default function FilterPanel({
  variant = "rail",
  open,
  onClose,
  facets,
  filters,
  priceBounds,
  activeCount,
  onToggle,
  onPriceChange,
  onSaleChange,
  onClearAll,
}) {
  const body = (
    <FilterBody
      facets={facets}
      filters={filters}
      priceBounds={priceBounds}
      onToggle={onToggle}
      onPriceChange={onPriceChange}
      onSaleChange={onSaleChange}
    />
  );

  if (variant === "rail") {
    return (
      <aside className="hidden w-64 shrink-0 lg:block" aria-label="Filters">
        <div className="sticky top-32 max-h-[calc(100dvh-10rem)] overflow-y-auto pr-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-espresso">
              Filter
            </h2>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-700 transition-colors hover:text-espresso"
              >
                Clear
              </button>
            )}
          </div>
          {body}
        </div>
      </aside>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-espresso/30 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 flex w-[88vw] max-w-sm flex-col bg-ivory-50 shadow-2xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
          >
            <div className="flex items-center justify-between border-b border-umber-50 px-5 py-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-espresso">Filter</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="text-espresso/50 transition-colors hover:text-espresso"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">{body}</div>

            <div className="grid grid-cols-2 gap-3 border-t border-umber-50 px-5 py-4">
              <button
                type="button"
                onClick={onClearAll}
                className="btn btn-md btn-secondary text-[11px]"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-md bg-espresso text-[11px] text-ivory-50"
              >
                Show results
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function FilterBody({ facets, filters, priceBounds, onToggle, onPriceChange, onSaleChange }) {
  const dimensions = Object.values(facets ?? {});

  return (
    <div className="space-y-1">
      <FilterGroup title="Price" defaultOpen>
        <PriceRangeSlider
          min={priceBounds[0]}
          max={priceBounds[1]}
          value={[filters.price.min ?? priceBounds[0], filters.price.max ?? priceBounds[1]]}
          onChange={onPriceChange}
        />
        <label className="mt-4 flex items-center gap-2.5 text-[13px] text-espresso-soft">
          <Checkbox checked={filters.onSale} onChange={() => onSaleChange(!filters.onSale)} />
          On sale only
        </label>
      </FilterGroup>

      {dimensions.map((facet, i) => (
        <FilterGroup key={facet.id} title={facet.label} defaultOpen={i < 2}>
          {facet.id === "color" ? (
            <SwatchGrid
              facet={facet}
              selected={filters.dimensions[facet.id] ?? []}
              onToggle={(value) => onToggle(facet.id, value)}
            />
          ) : (
            <ul className="space-y-2">
              {facet.values.map((value) => {
                const selected = (filters.dimensions[facet.id] ?? []).includes(value.id);
                // Kept visible but inert: hiding it would make the dimension
                // look exhausted when the option simply doesn't combine with
                // the current selection.
                const unavailable = value.count === 0 && !selected;

                return (
                  <li key={value.id}>
                    <label
                      className={cn(
                        "flex items-center justify-between gap-2 text-[13px]",
                        unavailable
                          ? "cursor-not-allowed text-espresso/25"
                          : "text-espresso-soft hover:text-espresso",
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <Checkbox
                          checked={selected}
                          disabled={unavailable}
                          onChange={() => onToggle(facet.id, value.id)}
                        />
                        {value.name}
                      </span>
                      <span className="tabular-nums text-[11px] text-espresso/35">
                        {value.count}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </FilterGroup>
      ))}
    </div>
  );
}

function FilterGroup({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-umber-50/70 py-3 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-1 text-left"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-espresso">
          {title}
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-espresso/40 transition-transform duration-300",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pt-3 pb-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** Colour reads faster as a swatch than as a word — the hex is in the taxonomy. */
function SwatchGrid({ facet, selected, onToggle }) {
  return (
    <ul className="flex flex-wrap gap-2.5">
      {facet.values.map((value) => {
        const isSelected = selected.includes(value.id);
        const unavailable = value.count === 0 && !isSelected;

        return (
          <li key={value.id}>
            <button
              type="button"
              onClick={() => onToggle(value.id)}
              disabled={unavailable}
              aria-pressed={isSelected}
              // Colour alone must not carry the meaning: the name and count go
              // in the accessible label, and selection shows as a check, not
              // just a ring.
              aria-label={`${value.name}, ${value.count} items`}
              title={`${value.name} (${value.count})`}
              className={cn(
                "relative flex size-7 items-center justify-center rounded-full ring-1 transition-all",
                isSelected ? "ring-2 ring-espresso ring-offset-2" : "ring-umber-100",
                unavailable ? "cursor-not-allowed opacity-25" : "hover:ring-espresso/50",
              )}
              style={{ backgroundColor: value.hex ?? "#ccc" }}
            >
              {isSelected && (
                <Check
                  className={cn(
                    "size-3.5",
                    isLightSwatch(value.hex) ? "text-espresso" : "text-ivory-50",
                  )}
                  aria-hidden="true"
                />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** Rough luminance test so the check mark stays legible on pale swatches. */
function isLightSwatch(hex) {
  if (!hex) return true;
  const value = hex.replace("#", "");
  if (value.length !== 6) return true;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

function Checkbox({ checked, disabled, onChange }) {
  return (
    <span className="relative flex size-4 shrink-0 items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="peer absolute inset-0 appearance-none rounded-sm border border-umber-100 transition-colors checked:border-espresso checked:bg-espresso disabled:cursor-not-allowed"
      />
      <Check
        className="pointer-events-none relative size-3 text-ivory-50 opacity-0 transition-opacity peer-checked:opacity-100"
        aria-hidden="true"
      />
    </span>
  );
}
