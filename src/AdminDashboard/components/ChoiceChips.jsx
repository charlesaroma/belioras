/* Admin Dashboard: ChoiceChips */
import { cn } from "@/utils/cn";

/** A set of on/off choices laid out as chips, for picking several at once. */
export default function ChoiceChips({ label, hint, options = [], selected = [], onToggle }) {
  return (
    <fieldset className="min-w-0">
      {label && <legend className="input-label">{label}</legend>}
      {hint && <p className="mb-2.5 text-[12px] leading-relaxed text-espresso-soft">{hint}</p>}
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const on = selected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(option.id)}
              className={cn(
                "inline-flex min-h-10 items-center gap-2 border px-3.5 text-[12px] tracking-[0.02em] transition-colors",
                on
                  ? "border-espresso bg-espresso text-ivory-50"
                  : "border-umber-100 bg-ivory-50 text-espresso-soft hover:border-espresso/50 hover:text-espresso",
              )}
            >
              {option.hex && (
                <span
                  aria-hidden="true"
                  className="size-2.5 border border-umber-50"
                  style={{ backgroundColor: option.hex }}
                />
              )}
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
