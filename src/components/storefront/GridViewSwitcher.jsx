/* Storefront Component: GridViewSwitcher */
import {
  DESKTOP_COLUMN_OPTIONS,
  MOBILE_COLUMN_OPTIONS,
  TABLET_COLUMN_OPTIONS,
} from "../../utils/gridColumns";
import GridDensityIcon from "../shared/GridDensityIcon";
import { cn } from "../../utils/cn";

/**
 * A segmented control sharing one border, rather than three loose icons. The
 * toolbar reads as one design that way: the same square corners, espresso
 * hairline and filled-on-active treatment as the Filter button next to it.
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
      className={cn("items-center", className)}
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
              // 44px where a finger picks it, 36px on desktop where a mouse
              // does. At p-1 alone the target was 34px on a phone.
              "flex size-11 cursor-pointer items-center justify-center transition-colors lg:size-9",
              // Each segment carries its own border and overlaps the one
              // before it, so neighbours share a single hairline. A border on
              // the group instead would sit outside the buttons and make the
              // control 2px taller than the Filter button beside it.
              "-ml-px border border-espresso first:ml-0",
              active
                ? "bg-espresso text-ivory-50"
                : "text-espresso hover:bg-espresso hover:text-ivory-50",
            )}
          >
            <GridDensityIcon columns={option} />
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
        className="inline-flex md:hidden"
      />
      <DensityGroup
        options={TABLET_COLUMN_OPTIONS}
        columns={columns}
        setColumns={setColumns}
        className="hidden md:inline-flex lg:hidden"
      />
      <DensityGroup
        options={DESKTOP_COLUMN_OPTIONS}
        columns={columns}
        setColumns={setColumns}
        className="hidden lg:inline-flex"
      />
    </>
  );
}
