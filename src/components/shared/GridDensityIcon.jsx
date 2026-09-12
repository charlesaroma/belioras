/* Shared Component: GridDensityIcon */

/**
 * Drawn rather than loaded. These were ten PNGs — a default and an active pair
 * per density — which is why the selected one carried its own gold frame and
 * could not match the controls beside it. As currentColor they invert with the
 * button, so the segment owns the styling and the icon just follows.
 *
 * Every icon is the same 20px box whatever the column count, so the segments
 * of the switcher come out identical widths.
 */

/* ICON BOX */
const WIDTH = 20;
const HEIGHT = 14;
const GAP = 1.5;

export default function GridDensityIcon({ columns, className }) {
  const count = columns === "row" ? 1 : columns;
  const bar = (WIDTH - GAP * (count - 1)) / count;

  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {Array.from({ length: count }, (_, i) => (
        <rect key={i} x={i * (bar + GAP)} y={0} width={bar} height={HEIGHT} />
      ))}
    </svg>
  );
}
