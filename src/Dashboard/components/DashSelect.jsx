/* Admin Dashboard: DashSelect */
import { ChevronDown } from "lucide-react";

import { cn } from "../../utils/cn";

/**
 * A dropdown for a list toolbar ("All providers", "All time"), the same height
 * and weight as the search and the Filters button beside it. Shows as active
 * once it is set to anything but its first option.
 */
export default function DashSelect({ label, value, onChange, options }) {
  const active = options.length > 0 && value !== options[0].value;
  return (
    <div className="relative shrink-0">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-12 cursor-pointer appearance-none border pl-4 pr-10 text-[11px] uppercase tracking-[0.12em] transition-colors focus-visible:border-espresso focus-visible:outline-none",
          active ? "border-espresso bg-espresso text-ivory-50" : "border-umber-100 bg-ivory-50 text-espresso hover:border-espresso",
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-ivory-50 text-espresso">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className={cn("pointer-events-none absolute right-3.5 top-1/2 size-3.5 -translate-y-1/2", active ? "text-ivory-50" : "text-espresso-soft")}
        aria-hidden="true"
      />
    </div>
  );
}
