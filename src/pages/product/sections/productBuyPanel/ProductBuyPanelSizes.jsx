/* Size Chips */
import { cn } from "../../../../utils/cn";
import { sizeLabel } from "../../../../utils/sizeLabel";

export default function ProductBuyPanelSizes({
  options = [],
  taxonomy,
  value,
  onChange = () => {},
  unavailable,
}) {
  if (!options.length) return null;

  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
      {options.map((size) => {
        const selected = size === value;
        // Sold out in the chosen colour. Shown struck through rather than
        // hidden, so a shopper can see the size exists and try another colour.
        const soldOut = Boolean(unavailable?.has(size));
        const label = sizeLabel(taxonomy, size);

        return (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={soldOut ? `${label}, sold out in this colour` : undefined}
            disabled={soldOut}
            onClick={() => onChange(size)}
            className={cn(
              "flex min-h-11 min-w-11 items-center justify-center border px-3 text-center text-xs uppercase tracking-wider transition-all duration-150",
              selected
                ? "border-espresso bg-espresso text-ivory-50"
                : soldOut
                  ? "cursor-not-allowed border-umber-50 text-espresso/30 line-through"
                  : "border-umber-100 bg-transparent text-espresso-soft hover:border-espresso",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
