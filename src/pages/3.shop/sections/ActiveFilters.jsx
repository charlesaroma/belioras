import { X } from "lucide-react";

import { useCurrency } from "../../../context/CurrencyContext";

/**
 * The filters currently applied, each individually removable.
 *
 * Without this, a shopper who scrolled past the panel has no idea why the grid
 * is short — the state is visible only where they set it. Chips wrap onto as
 * many rows as they need rather than clipping into one: a hidden filter is
 * worse than no filter, because it is invisible *and* still narrowing results.
 */
export default function ActiveFilters({ facets, filters, onToggle, onClearPrice, onSaleChange, onClearAll }) {
  const { format } = useCurrency();

  const chips = [];

  for (const [dimension, values] of Object.entries(filters.dimensions)) {
    const facet = facets?.[dimension];
    for (const value of values) {
      const match = facet?.values.find((v) => v.id === value);
      chips.push({
        key: `${dimension}:${value}`,
        label: match?.name ?? value,
        group: facet?.label ?? dimension,
        onRemove: () => onToggle(dimension, value),
      });
    }
  }

  if (filters.price.min !== null || filters.price.max !== null) {
    const from = filters.price.min !== null ? format(filters.price.min) : null;
    const to = filters.price.max !== null ? format(filters.price.max) : null;
    chips.push({
      key: "price",
      group: "Price",
      label: from && to ? `${from} – ${to}` : from ? `From ${from}` : `Up to ${to}`,
      onRemove: onClearPrice,
    });
  }

  if (filters.onSale) {
    chips.push({
      key: "sale",
      group: "Offers",
      label: "On sale",
      onRemove: () => onSaleChange(false),
    });
  }

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          aria-label={`Remove filter ${chip.group}: ${chip.label}`}
          className="group inline-flex items-center gap-1.5 border border-umber-100 py-1 pl-3 pr-2 text-[11px] uppercase tracking-[0.1em] text-espresso transition-colors hover:border-espresso"
        >
          <span className="text-espresso/40">{chip.group}</span>
          <span>{chip.label}</span>
          <X
            className="size-3 text-espresso/40 transition-colors group-hover:text-espresso"
            aria-hidden="true"
          />
        </button>
      ))}

      {chips.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="ml-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-700 underline underline-offset-4 transition-colors hover:text-espresso"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
