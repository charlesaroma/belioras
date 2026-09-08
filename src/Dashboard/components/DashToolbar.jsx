import { Search, X } from "lucide-react";

import { cn } from "../../utils/cn";

/**
 * Search, filters and page actions above a table.
 *
 * Every list page hand-rolled this row, and on three of them the search input
 * had no value and no onChange and the Filter button had no onClick — controls
 * that looked operable and were not. This is the working version, and it is
 * controlled, so the page owns the query.
 */
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

/**
 * Segmented status filter.
 *
 * A row of options beats a dropdown here: there are never more than five, and
 * showing the counts inline answers "how many are drafts?" without a click.
 */
export function FilterTabs({ options, value, onChange, ariaLabel = "Filter" }) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex border border-umber-50">
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={cn(
              "border-r border-umber-50 px-3.5 py-2 text-[11px] uppercase tracking-[0.12em] transition-colors last:border-r-0",
              active
                ? "bg-espresso text-ivory-50"
                : "text-espresso-soft hover:bg-brown-50/60 hover:text-espresso",
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

/** Page-through control. Hidden entirely when everything fits on one page. */
export function Pagination({ page, pageCount, total, onPageChange, unit = "items" }) {
  if (pageCount <= 1) {
    return (
      <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-espresso-soft">
        {total} {unit}
      </p>
    );
  }

  return (
    <div className="mt-4 flex items-center justify-between gap-4">
      <p className="text-[11px] uppercase tracking-[0.14em] text-espresso-soft">
        Page {page} of {pageCount} · {total} {unit}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="btn btn-sm btn-secondary"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          className="btn btn-sm btn-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
}
