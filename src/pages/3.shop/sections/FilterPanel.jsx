import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import Drawer from "../../../components/common/Drawer";
import { useCurrency } from "../../../context/CurrencyContext";
import { cn } from "../../../utils/cn";
import PriceRangeSlider from "./PriceRangeSlider";

/**
 * Faceted filter drawer.
 *
 * Follows the drawer pattern from the design prototype — a left slide-over at
 * every breakpoint rather than a rail — with two things the prototype lacked:
 * selections live in the URL (see useFilterParams) so a filtered view is
 * shareable, and every value carries a live count so a filter never leads to
 * an empty grid.
 *
 * Generated from the taxonomy rather than hardcoded, so an attribute Belioras
 * adds in the dashboard appears here with no code change.
 */
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
    <Drawer
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
          <FilterSection
            key={facet.id}
            title={facet.label}
            defaultOpen={i === 0}
            selectedCount={(filters.dimensions[facet.id] ?? []).length}
          >
            {/* Two columns: the prototype's choice, and it roughly halves the
                scrolling on dimensions with a dozen values. */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {facet.values.map((value) => {
                const selected = (filters.dimensions[facet.id] ?? []).includes(value.id);
                // Kept visible but inert: hiding it would make the dimension
                // look exhausted when the option is an alternative, not an
                // addition to the current selection.
                const unavailable = value.count === 0 && !selected;

                return (
                  <FilterCheckbox
                    key={value.id}
                    checked={selected}
                    disabled={unavailable}
                    count={value.count}
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
          </FilterSection>
        ))}

        <PriceSection
          bounds={priceBounds}
          filters={filters}
          onPriceChange={onPriceChange}
          onSaleChange={onSaleChange}
        />
      </div>
    </Drawer>
  );
}

/**
 * Collapsed sections turn gold when they hold a selection — otherwise a
 * shopper who has scrolled past a closed accordion has no way to tell which
 * ones are narrowing the results.
 */
function FilterSection({ title, defaultOpen = false, selectedCount = 0, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const isActive = selectedCount > 0;

  return (
    <div className="border-b border-umber-50 py-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left"
      >
        <span
          className={cn(
            "text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors",
            isActive ? "text-gold-700" : "text-espresso",
          )}
        >
          {title}
          {isActive && <span className="ml-1.5 tabular-nums">({selectedCount})</span>}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-espresso/40 transition-transform duration-300",
            !open && "-rotate-90",
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
          <div className="pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

function PriceSection({ bounds, filters, onPriceChange, onSaleChange }) {
  const { symbol } = useCurrency();
  const lo = filters.price.min ?? bounds[0];
  const hi = filters.price.max ?? bounds[1];

  return (
    <div className="py-5">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-espresso">
        Price
      </p>

      {/* Number inputs alongside the slider: typing an exact bound is faster
          than dragging to it, and it is the only precise option on touch. */}
      <div className="mb-5 flex items-center gap-3">
        <PriceInput
          label="Minimum price"
          value={lo}
          min={bounds[0]}
          max={hi}
          symbol={symbol}
          onCommit={(v) => onPriceChange([Math.min(v, hi), hi])}
        />
        <span className="text-espresso/30">—</span>
        <PriceInput
          label="Maximum price"
          value={hi}
          min={lo}
          max={bounds[1]}
          symbol={symbol}
          onCommit={(v) => onPriceChange([lo, Math.max(v, lo)])}
        />
      </div>

      <PriceRangeSlider
        min={bounds[0]}
        max={bounds[1]}
        value={[lo, hi]}
        onChange={onPriceChange}
        showLabels={false}
      />

      <label className="mt-5 flex cursor-pointer items-center gap-2.5 text-[13px] text-espresso-soft">
        <NativeCheckbox checked={filters.onSale} onChange={() => onSaleChange(!filters.onSale)} />
        On sale only
      </label>
    </div>
  );
}

function PriceInput({ label, value, min, max, symbol, onCommit }) {
  const [draft, setDraft] = useState(null);

  return (
    <span className="inline-flex items-center gap-1 border border-umber-100 px-2 py-1.5 focus-within:border-espresso">
      <span aria-hidden="true" className="text-xs text-espresso/40">
        {symbol}
      </span>
      <input
        type="number"
        inputMode="numeric"
        aria-label={label}
        min={min}
        max={max}
        // Held as a draft while typing: committing on every keystroke would
        // re-filter on an intermediate value like "1" on the way to "150".
        value={draft ?? value}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft !== null && draft !== "") onCommit(Number(draft));
          setDraft(null);
        }}
        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        className="w-16 bg-transparent font-mono text-sm text-espresso outline-none"
      />
    </span>
  );
}

function FilterCheckbox({ checked, disabled, label, count, onChange }) {
  return (
    <label
      className={cn(
        "flex items-center justify-between gap-2 text-[13px]",
        disabled
          ? "cursor-not-allowed text-espresso/25"
          : "cursor-pointer text-espresso-soft hover:text-espresso",
      )}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <NativeCheckbox checked={checked} disabled={disabled} onChange={onChange} />
        <span className="truncate">{label}</span>
      </span>
      <span className="shrink-0 tabular-nums text-[11px] text-espresso/35">{count}</span>
    </label>
  );
}

function NativeCheckbox({ checked, disabled, onChange }) {
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
