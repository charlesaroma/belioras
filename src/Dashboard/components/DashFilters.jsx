/* Admin Dashboard: DashFilters */
import { useEffect, useId, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { cn } from "../../utils/cn";

/**
 * A "Filters" button and the panel it opens: groups of checkboxes, several
 * values allowed per group. `value` is `{ [groupId]: string[] }`; an empty or
 * missing group filters nothing. `onChange` is called like a state setter, with
 * a value or a function of the latest value. Pair with DashFilterChips.
 */
export default function DashFilters({ groups, value, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const panelId = useId();
  const active = groups.reduce((n, g) => n + (value[g.id]?.length ?? 0), 0);

  const [place, setPlace] = useState(null);

  // Placed against the screen, not the button: anchored at the button's left
  // edge it ran past the right of the screen whenever the button sat right of
  // centre, and the whole page scrolled sideways. Kept 16px inside both edges.
  useEffect(() => {
    if (!open) return undefined;
    const measure = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = Math.min(window.innerWidth - 32, 640);
      const left = Math.min(Math.max(16, rect.left), window.innerWidth - width - 16);
      setPlace({ top: rect.bottom + 8, left, width, maxHeight: Math.max(240, window.innerHeight - rect.bottom - 24) });
    };
    measure();
    const onDown = (e) => !rootRef.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", measure);
    // Capture: the dashboard scrolls inside <main>, not the window.
    document.addEventListener("scroll", measure, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", measure);
      document.removeEventListener("scroll", measure, true);
    };
  }, [open]);

  // A function of the latest filters, so quick successive ticks all count.
  const toggle = (group, option) =>
    onChange((latest) => {
      const current = latest[group] ?? [];
      const next = current.includes(option) ? current.filter((v) => v !== option) : [...current, option];
      return { ...latest, [group]: next };
    });

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          "flex h-10 items-center gap-2 border px-3.5 text-[11px] uppercase tracking-[0.12em] transition-colors",
          active ? "border-espresso bg-espresso text-ivory-50" : "border-umber-100 bg-ivory-50 text-espresso hover:border-espresso",
        )}
      >
        <SlidersHorizontal className="size-3.5" aria-hidden="true" />
        Filters
        {active > 0 && <span className="tabular-nums opacity-70">{active}</span>}
      </button>

      {open && place && (
        <div
          id={panelId}
          style={{ top: place.top, left: place.left, width: place.width }}
          className="fixed z-40 flex flex-col border border-umber-100 bg-ivory-50 shadow-lg"
        >
          <div style={{ maxHeight: place.maxHeight - 60 }} className="grid gap-6 overflow-y-auto p-5 sm:grid-cols-2">
            {groups.map((group) => (
              <fieldset key={group.id} className="min-w-0">
                <legend className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-espresso-soft">
                  {group.label}
                </legend>
                <div className="space-y-0.5">
                  {group.options.map((option) => (
                    <label key={option.value} className="flex min-h-9 cursor-pointer items-center gap-2.5 px-1 text-[13px] text-espresso hover:bg-brown-50">
                      <input
                        type="checkbox"
                        checked={(value[group.id] ?? []).includes(option.value)}
                        onChange={() => toggle(group.id, option.value)}
                        className="size-3.5 accent-espresso"
                      />
                      {option.swatch && (
                        <span aria-hidden="true" className="size-3 shrink-0 border border-umber-100" style={{ backgroundColor: option.swatch }} />
                      )}
                      <span className="min-w-0 flex-1 truncate">{option.label}</span>
                      {option.count !== undefined && <span className="tabular-nums text-[11px] text-espresso-soft">{option.count}</span>}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <div className="flex justify-between gap-3 border-t border-umber-50 px-5 py-3">
            <button
              type="button"
              onClick={() => onChange({})}
              disabled={!active}
              className="text-[11px] uppercase tracking-[0.14em] text-espresso-soft transition-colors hover:text-espresso disabled:opacity-40"
            >
              Clear all
            </button>
            <button type="button" onClick={() => setOpen(false)} className="btn btn-sm btn-primary">
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
