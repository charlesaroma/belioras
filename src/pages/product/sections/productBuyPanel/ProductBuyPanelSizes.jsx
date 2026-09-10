/* Size Chips */
import { cn } from "../../../../utils/cn";

export default function ProductBuyPanelSizes({ options = [], value, onChange = () => {} }) {
  if (!options.length) return null;

  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
      {options.map((size) => {

        const selected = size === value;
        return (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(size)}
            className={cn(
              "flex min-h-11 min-w-11 items-center justify-center border px-3 text-center text-xs uppercase tracking-wider transition-all duration-150",
              selected
                ? "border-espresso bg-espresso text-ivory-50"
                : "border-umber-100 bg-transparent text-espresso-soft hover:border-espresso",
            )}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
