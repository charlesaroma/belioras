/* Storefront Component: SizeChartUnitToggle */
import { cn } from "../../../utils/cn";
import { UNITS } from "../../../utils/measurements";

export default function SizeChartUnitToggle({ unit, onChange }) {
  return (
    <div
      role="radiogroup"
      aria-label="Measurement unit"
      className="inline-flex border border-espresso"
    >
      {UNITS.map((option) => {
        const selected = option === unit;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option)}
            className={cn(
              "min-h-9 px-4 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors",
              selected ? "bg-espresso text-ivory-50" : "text-espresso hover:bg-brown-50",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
