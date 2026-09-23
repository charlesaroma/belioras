/* Admin Dashboard: DashTabs */
import { cn } from "../../utils/cn";

/**
 * Views of one list (All · Active · Draft · Sold out), drawn as tabs across
 * the list's top rather than buttons in its toolbar. Scrolls sideways on its
 * own when it cannot fit, never the page.
 */
export default function DashTabs({ options, value, onChange, ariaLabel = "View" }) {
  return (
    <div className="shrink-0 overflow-x-auto border-b border-umber-100">
      <div role="tablist" aria-label={ariaLabel} className="flex min-w-max gap-6">
        {options.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(option.value)}
              className={cn(
                "-mb-px flex min-h-11 items-center gap-2 border-b-2 text-[12px] uppercase tracking-[0.14em] transition-colors",
                active ? "border-espresso text-espresso" : "border-transparent text-espresso-soft hover:text-espresso",
              )}
            >
              {option.label}
              {option.count !== undefined && (
                <span
                  className={cn(
                    "min-w-6 px-1.5 py-0.5 text-center text-[10px] tabular-nums tracking-normal",
                    active ? "bg-espresso text-ivory-50" : "bg-umber-50 text-espresso-soft",
                  )}
                >
                  {option.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
