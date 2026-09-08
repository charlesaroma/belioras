import { cn } from "../../utils/cn";

/** Size chips. Sizes are stored lowercase and shown uppercase. */
export default function SizeSelector({ options = [], value, onChange = () => {} }) {
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
              "min-w-[44px] border px-3 py-2.5 text-center text-xs uppercase tracking-wider transition-all duration-150",
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
