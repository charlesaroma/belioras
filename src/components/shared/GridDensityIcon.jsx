/* Shared Component: GridDensityIcon */
import { cn } from "../../utils/cn";

/* INTRINSIC HEIGHT */
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
      className={cn("h-[26px] w-auto select-none", className)}
    />
  );
}
