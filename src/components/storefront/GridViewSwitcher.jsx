/* Storefront Component: GridViewSwitcher */
import {
  DESKTOP_COLUMN_OPTIONS,
  MOBILE_COLUMN_OPTIONS,
  TABLET_COLUMN_OPTIONS,
} from "../../utils/gridColumns";
import GridDensityIcon from "../shared/GridDensityIcon";
import { cn } from "../../utils/cn";

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
              // 44px where a finger picks it, 36px on desktop where a mouse
              // does. At p-1 alone the target was 34px on a phone.
              "flex size-11 cursor-pointer items-center justify-center transition-opacity lg:size-9",
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
        className="flex items-center gap-2 md:hidden"
      />
      <DensityGroup
        options={TABLET_COLUMN_OPTIONS}
        columns={columns}
        setColumns={setColumns}
        className="hidden items-center gap-2 md:flex lg:hidden"
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
