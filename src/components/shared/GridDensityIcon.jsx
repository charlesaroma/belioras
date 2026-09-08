import { cn } from "../../utils/cn";

/**
 * Grid-density glyph, rendered from the supplied artwork in /public/icons.
 *
 * Each option has a default and an active file, so the selected state is a
 * different image rather than a colour change — which is why `active` has to
 * reach this component instead of being handled by the parent's text colour.
 *
 * Assets are 26px tall with widths that grow by column count (26 / 36 / 46 /
 * 66), so a six-column icon reads as denser than a two-column one. They are
 * rendered below their intrinsic height rather than above it: downscaling a
 * raster stays sharp, upscaling does not.
 */
const INTRINSIC_HEIGHT = 26;

const WIDTHS = { 2: 26, 3: 36, 4: 46, 6: 66, row: 26 };

export default function GridDensityIcon({ columns, active = false, className }) {
  const key = columns === "row" ? "row" : columns;
  const state = active ? "active" : "default";

  return (
    <img
      src={`/icons/grid-${key}-${state}.png`}
      alt=""
      aria-hidden="true"
      draggable="false"
      // Intrinsic dimensions are declared so the row reserves the right space
      // before the images load and the toolbar does not shift.
      width={WIDTHS[key] ?? INTRINSIC_HEIGHT}
      height={INTRINSIC_HEIGHT}
      className={cn("h-[13px] w-auto select-none", className)}
    />
  );
}
