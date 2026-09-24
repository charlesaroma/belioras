/* Admin Dashboard: DashFilters */
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { cn } from "../../utils/cn";

/**
 * A "Filters" button and the drawer it slides in from the right: groups of checkboxes, several
 * values allowed per group. `value` is `{ [groupId]: string[] }`; an empty or
 * missing group filters nothing. `onChange` is called like a state setter, with
 * a value or a function of the latest value. Pair with DashFilterChips.
 *
 * An option may carry `section` (a sub-heading it is listed under, so labels
 * need not repeat it) and `shortLabel` (what shows in the panel; `label` stays
 * the full name used by the chips).
 */
export default function DashFilters({ groups, value, onChange }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const active = groups.reduce((n, g) => n + (value[g.id]?.length ?? 0), 0);
  const [query, setQuery] = useState("");

  /* Side Effect */
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // A function of the latest filters, so quick successive ticks all count.
  const toggle = (group, option) =>
    onChange((latest) => {
      const current = latest[group] ?? [];
      const next = current.includes(option) ? current.filter((v) => v !== option) : [...current, option];
      return { ...latest, [group]: next };
    });

  const q = query.trim().toLowerCase();
  const shown = groups
    .map((g) => ({ ...g, options: g.options.filter((o) => !q || `${o.label} ${o.shortLabel ?? ""}`.toLowerCase().includes(q)) }))
    .filter((g) => g.options.length > 0);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setQuery("");
          setOpen(true);
        }}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          "flex h-12 items-center gap-2 border px-4 text-[11px] uppercase tracking-[0.12em] transition-colors",
          active ? "border-espresso bg-espresso text-ivory-50" : "border-umber-100 bg-ivory-50 text-espresso hover:border-espresso",
        )}
      >
        <SlidersHorizontal className="size-3.5" aria-hidden="true" />
        Filters
        {active > 0 && <span className="tabular-nums opacity-70">{active}</span>}
      </button>

      {createPortal(
        <div className={cn("fixed inset-0 z-50", !open && "pointer-events-none")} inert={!open}>
          <div
            onClick={() => setOpen(false)}
            aria-hidden="true"
            className={cn("absolute inset-0 bg-espresso/40 transition-opacity duration-200", open ? "opacity-100" : "opacity-0")}
          />
          <aside
            id={panelId}
            role="dialog"
            aria-label="Filters"
            className={cn(
              "absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ivory-50 shadow-2xl transition-transform ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
              open ? "translate-x-0 duration-300" : "translate-x-full duration-200",
            )}
          >
            <div className="flex items-center justify-between border-b border-umber-50 px-6 py-4">
              <h2 className="font-display text-lg tracking-wide text-espresso">
                Filters{active > 0 && <span className="ml-2 text-[12px] tabular-nums text-gold-700">{active} chosen</span>}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close filters"
                className="flex size-9 items-center justify-center text-espresso-soft transition-colors hover:text-espresso"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="border-b border-umber-50 px-6 py-3">
              <label className="flex items-center gap-2 border border-umber-100 bg-white px-3">
                <Search className="size-3.5 text-espresso-soft" aria-hidden="true" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Find a filter"
                  aria-label="Find a filter"
                  className="h-9 w-full bg-transparent text-[13px] outline-none placeholder:text-espresso-soft"
                />
              </label>
            </div>

            <div className="flex-1 space-y-7 overflow-y-auto px-6 py-5">
              {shown.length === 0 && <p className="text-[13px] text-espresso-soft">Nothing matches “{query}”.</p>}
              {shown.map((group) => {
                const picked = value[group.id]?.length ?? 0;
                let section = null;
                return (
                  <fieldset key={group.id} className="min-w-0">
                    <legend className="mb-2 flex w-full items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-espresso-soft">
                      {group.label}
                      {picked > 0 && <span className="tabular-nums text-gold-700">{picked} chosen</span>}
                    </legend>
                    <div className="space-y-0.5">
                      {group.options.map((option) => {
                        const on = (value[group.id] ?? []).includes(option.value);
                        const heading = option.section && option.section !== section ? option.section : null;
                        section = option.section ?? section;
                        return (
                          <div key={option.value}>
                            {heading && (
                              <p className="mb-0.5 mt-3 px-1 text-[11px] font-medium tracking-wide text-espresso first:mt-0">{heading}</p>
                            )}
                            <label
                              className={cn(
                                "flex min-h-10 cursor-pointer items-center gap-2.5 px-1 text-[13px] text-espresso transition-colors hover:bg-brown-50",
                                on && "bg-brown-50/70 font-medium",
                                option.section && "pl-3",
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={on}
                                onChange={() => toggle(group.id, option.value)}
                                className="size-3.5 accent-espresso"
                              />
                              {option.swatch && (
                                <span aria-hidden="true" className="size-3 shrink-0 border border-umber-100" style={{ backgroundColor: option.swatch }} />
                              )}
                              <span className="min-w-0 flex-1 truncate">{option.shortLabel ?? option.label}</span>
                              {option.count !== undefined && <span className="tabular-nums text-[11px] text-espresso-soft">{option.count}</span>}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </fieldset>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-umber-50 px-6 py-4">
              <button
                type="button"
                onClick={() => onChange({})}
                disabled={!active}
                className="text-[11px] uppercase tracking-[0.14em] text-espresso-soft transition-colors hover:text-espresso disabled:opacity-40"
              >
                Clear all
              </button>
              <button type="button" onClick={() => setOpen(false)} className="btn btn-md btn-primary">
                Done
              </button>
            </div>
          </aside>
        </div>,
        document.body,
      )}
    </>
  );
}
