/* Page: Shop - PriceRangeSlider */
import { useCurrency } from "../../../context/CurrencyContext";
import { cn } from "../../../utils/cn";

/* Shared thumb styling. Both vendor pseudo-elements need it spelled out; they
   cannot be combined into one selector, since an unknown pseudo-element
   invalidates the whole rule. */

const THUMB = cn(
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none",
  "[&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:rounded-full",
  "[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border",
  "[&::-webkit-slider-thumb]:border-umber-100",
  "[&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(18,7,0,0.28)]",
  "[&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:transition-transform",
  "active:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:cursor-grabbing",
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none",
  "[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full",
  "[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border",
  "[&::-moz-range-thumb]:border-umber-100",
  "[&::-moz-range-thumb]:shadow-[0_1px_4px_rgba(18,7,0,0.28)]",
  "[&::-moz-range-thumb]:cursor-grab",
);

const INPUT = cn(
  "pointer-events-none absolute inset-x-0 top-1/2 h-5 w-full -translate-y-1/2 appearance-none bg-transparent",
  "focus:outline-none",
  // Keyboard focus has to land somewhere visible, and the input itself has no box.
  "focus-visible:[&::-webkit-slider-thumb]:ring-2 focus-visible:[&::-webkit-slider-thumb]:ring-gold-500",
  "focus-visible:[&::-webkit-slider-thumb]:ring-offset-2",
  THUMB,
);

function PriceRangeSlider({ min, max, value, onChange, showLabels = true }) {
  const [lo, hi] = value;
  // Prices are stored in EUR; the slider must read in whatever the shopper
  // selected, not a hardcoded euro sign.
  const { format } = useCurrency();

  const span = Math.max(max - min, 1);

  const loPct = ((lo - min) / span) * 100;

  const hiPct = ((hi - min) / span) * 100;

  return (
    <div className="px-1">
      {showLabels && (
        <div className="mb-4 flex items-center justify-between text-[13px] tabular-nums text-espresso">
          <span>{format(lo)}</span>
          <span className="text-espresso/30">—</span>
          <span>{format(hi)}</span>
        </div>
      )}

      <div className="relative h-5">
        {/* Unfilled track */}
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-umber-50" />
        {/* Selected span */}
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-espresso"
          style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }}
        />

        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          aria-label="Minimum price"
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi), hi])}
          // Once the handles meet at the top of the range the lower one would
          // be unreachable underneath its sibling; raising it keeps it grabbable.
          className={cn(INPUT, loPct > 90 ? "z-20" : "z-10")}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          aria-label="Maximum price"
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo)])}
          className={cn(INPUT, "z-10")}
        />
      </div>
    </div>
  );
}

export default PriceRangeSlider;
