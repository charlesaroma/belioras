/* Admin Dashboard: DashToolbar */
import { Search, X } from "lucide-react";

import { cn } from "../../utils/cn";

export default function DashToolbar({
  query,
  onQueryChange,
  placeholder = "Search…",
  filters,
  children,
  className,
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <div className="relative min-w-[200px] flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-espresso/35"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="input w-full pl-9 pr-9"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-espresso/35 transition-colors hover:text-espresso"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {filters}

      <div className="ml-auto flex items-center gap-2">{children}</div>
    </div>
  );
}

export function FilterTabs({ options, value, onChange, ariaLabel = "Filter" }) {
  return (
    // flex-wrap because four tabs at ~360px exceeded the 335px available on a
    // 375px phone and could not break, which pushed the whole page sideways.
    // The border moves to each button so a wrapped row still reads as a group.
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-px bg-umber-50">
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={cn(
              "px-3.5 py-2 text-[11px] uppercase tracking-[0.12em] transition-colors",
              active
                ? "bg-espresso text-ivory-50"
                : "bg-ivory-50 text-espresso-soft hover:bg-brown-50 hover:text-espresso",
            )}
          >
            {option.label}
            {option.count !== undefined && (
              <span className={cn("ml-1.5 tabular-nums", active ? "opacity-60" : "opacity-45")}>
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
