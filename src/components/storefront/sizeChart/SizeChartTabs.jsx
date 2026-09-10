import { useRef } from "react";

import { cn } from "../../../utils/cn";

/**
 * Tab strip for the size chart.
 *
 * The dashboard has a similar-looking strip in CategoriesTableViewTabs, but it
 * is hardcoded to its page and sits across the Dashboard boundary, so this is
 * its own. It also adds what that one lacks and the WAI-ARIA tabs pattern
 * requires: one tab stop for the whole strip, arrow keys to move between tabs,
 * Home/End to jump, and aria-controls pointing at the panel.
 */
export default function SizeChartTabs({ tabs, active, onChange, idBase }) {
  const refs = useRef([]);

  const move = (fromIndex, delta) => {
    const next = (fromIndex + delta + tabs.length) % tabs.length;
    onChange(tabs[next].id);
    refs.current[next]?.focus();
  };

  const onKeyDown = (e, index) => {
    const key = e.key;
    if (key === "ArrowRight" || key === "ArrowDown") {
      e.preventDefault();
      move(index, 1);
    } else if (key === "ArrowLeft" || key === "ArrowUp") {
      e.preventDefault();
      move(index, -1);
    } else if (key === "Home") {
      e.preventDefault();
      move(index, -index);
    } else if (key === "End") {
      e.preventDefault();
      move(index, tabs.length - 1 - index);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Size chart view"
      className="flex gap-6 border-b border-umber-50"
    >
      {tabs.map((tab, i) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${idBase}-tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`${idBase}-panel-${tab.id}`}
            // Roving tabindex: the strip is one stop, arrows move within it.
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "-mb-px min-h-11 border-b-2 text-sm transition-colors",
              selected
                ? "border-espresso font-medium text-espresso"
                : "border-transparent text-espresso/45 hover:text-espresso",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
