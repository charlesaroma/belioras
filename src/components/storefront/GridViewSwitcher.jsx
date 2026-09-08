import {
  DESKTOP_COLUMN_OPTIONS,
  MOBILE_COLUMN_OPTIONS,
  TABLET_COLUMN_OPTIONS,
} from "../../utils/gridColumns";
import GridDensityIcon from "../shared/GridDensityIcon";
import { cn } from "../../utils/cn";

/**
 * Product-grid density control.
 *
 * Uses the supplied artwork in /public/icons for the glyphs themselves. The
 * improvements over the prototype's version are behavioural:
 *
 *  - `radiogroup` semantics rather than a row of `aria-pressed` buttons. This
 *    is one choice from a set, not five independent toggles, and the difference
 *    is what a screen reader announces as "2 of 3".
 *  - Roving tabindex with arrow-key navigation, which is what the radiogroup
 *    pattern promises once it is announced as one.
 *  - Only the visible set is rendered per breakpoint, so the hidden one is not
 *    reachable by keyboard — the same defect that was in the mega menu.
 */
function DensityGroup({ options, columns, setColumns, className }) {
  // The two breakpoint sets do not overlap completely — a desktop choice of 4
  // or 6 has no equivalent in the tablet set. Without a fallback tab stop the
  // whole group would then have tabIndex -1 on every option and become
  // unreachable by keyboard.
  const selectedIndex = options.indexOf(columns);
  const tabStopIndex = selectedIndex === -1 ? 0 : selectedIndex;

  const onKeyDown = (e) => {
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!delta) return;
    e.preventDefault();
    setColumns(options[(tabStopIndex + delta + options.length) % options.length]);
  };

  return (
    <div
      role="radiogroup"
      aria-label="Products per row"
      className={className}
      onKeyDown={onKeyDown}
    >
      {options.map((option, i) => {
        const active = columns === option;
        const label = option === "row" ? "One per row" : `${option} per row`;

        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            // Roving tabindex: the group is one tab stop, arrows move within it.
            tabIndex={i === tabStopIndex ? 0 : -1}
            onClick={() => setColumns(option)}
            className={cn(
              "flex cursor-pointer items-center justify-center p-1 transition-opacity",
              active ? "opacity-100" : "opacity-50 hover:opacity-80",
            )}
          >
            <GridDensityIcon columns={option} active={active} />
          </button>
        );
      })}
    </div>
  );
}

export default function GridViewSwitcher({ columns, setColumns }) {
  return (
    <>
      {/* Below md: one-per-row or two — anything denser makes a card too
          narrow to read the price without zooming. This group used to not
          exist at all, so the control was invisible on a phone. */}
      <DensityGroup
        options={MOBILE_COLUMN_OPTIONS}
        columns={columns}
        setColumns={setColumns}
        className="flex items-center gap-1 md:hidden"
      />
      <DensityGroup
        options={TABLET_COLUMN_OPTIONS}
        columns={columns}
        setColumns={setColumns}
        className="hidden items-center gap-1 md:flex lg:hidden"
      />
      <DensityGroup
        options={DESKTOP_COLUMN_OPTIONS}
        columns={columns}
        setColumns={setColumns}
        className="hidden items-center gap-1 lg:flex"
      />
    </>
  );
}
