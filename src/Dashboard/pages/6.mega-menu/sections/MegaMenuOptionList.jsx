/* Admin Dashboard Page: Mega-menu - MegaMenuOptionList */
import { Fragment } from "react";

import { cn } from "@/utils/cn";
import { piecesText } from "./megaMenuPickerOptions";

/** The values to choose from, each with how many pieces it would show. */
export default function MegaMenuOptionList({ options, selected, multi, countOf, onPick }) {
  if (!options.length) {
    return (
      <p className="text-[13px] text-espresso-soft">
        Nothing to choose here yet. Add some under Categories &amp; Colours first.
      </p>
    );
  }

  return (
    <div
      role={multi ? "group" : "radiogroup"}
      aria-label="Options"
      className="grid max-h-72 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-2"
    >
      {options.map((option, i) => {
        const on = selected.includes(option.value);
        const count = countOf(option.value);
        const heading = option.group && option.group !== options[i - 1]?.group ? option.group : null;

        return (
          <Fragment key={option.value}>
            {heading && (
              <p className="col-span-full pt-2 text-[10px] uppercase tracking-[0.18em] text-espresso-soft">
                {heading}
              </p>
            )}
            <button
              type="button"
              role={multi ? undefined : "radio"}
              aria-checked={multi ? undefined : on}
              aria-pressed={multi ? on : undefined}
              onClick={() => onPick(option.value)}
              className={cn(
                "flex min-h-11 items-center justify-between gap-3 border px-3 text-left text-[13px] transition-colors",
                on
                  ? "border-espresso bg-espresso text-ivory-50"
                  : "border-umber-100 bg-white text-espresso hover:border-espresso/50",
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                {option.hex && (
                  <span
                    aria-hidden="true"
                    className="size-3 shrink-0 border border-umber-100"
                    style={{ backgroundColor: option.hex }}
                  />
                )}
                <span className="truncate">{option.name}</span>
              </span>
              <span
                className={cn(
                  "shrink-0 text-[11px] tabular-nums",
                  on ? "text-ivory-50/70" : count === 0 ? "text-gold-700" : "text-espresso-soft",
                )}
              >
                {piecesText(count)}
              </span>
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}
