/* Price Range And Sale Toggle */
import { useState } from "react";
import { useCurrency } from "../../../../context/CurrencyContext";
import PriceRangeSlider from "../PriceRangeSlider";
import { NativeCheckbox } from "./ShopFilterCheckbox";

export default function ShopFilterPrice({ bounds, filters, onPriceChange, onSaleChange }) {
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

      <label className="mt-5 flex min-h-11 cursor-pointer items-center gap-2.5 text-[13px] text-espresso-soft lg:min-h-0">
        <NativeCheckbox checked={filters.onSale} onChange={() => onSaleChange(!filters.onSale)} />
        On sale only
      </label>
    </div>
  );
}

function PriceInput({ label, value, min, max, symbol, onCommit }) {
  const [draft, setDraft] = useState(null);

  return (
    <span className="inline-flex min-h-11 items-center gap-1 border border-umber-100 px-2 focus-within:border-espresso lg:min-h-0 lg:py-1.5">
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
