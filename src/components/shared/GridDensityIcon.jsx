/**
 * Grid-density glyph — an outlined frame holding N vertical bars, one per
 * column, or stacked horizontal bars for the single-column row layout.
 *
 * Drawn rather than loaded as image files. The prototype shipped ten PNGs for
 * this (a default and an active state for each of row/2/3/4/6); rendering them
 * means they stay crisp at any zoom or pixel density, a new column option needs
 * no new asset, the active state is a colour change rather than a second file,
 * and the catalog page makes ten fewer requests.
 *
 * The frame widens with the column count, so a six-column icon reads as denser
 * than a two-column one at a glance rather than only on inspection.
 */
const BAR = 3; // bar width
const GAP = 2; // space between bars
const PAD = 2.5; // inset from the frame
const HEIGHT = 18;

export default function GridDensityIcon({ columns, className }) {
  const isRow = columns === "row";
  const count = isRow ? 3 : columns;

  // Row layout is a fixed square; column layouts grow with their bar count.
  const width = isRow ? 26 : count * BAR + (count - 1) * GAP + PAD * 2;

  const bars = isRow
    ? Array.from({ length: 3 }, (_, i) => ({
        x: PAD,
        y: PAD + i * ((HEIGHT - PAD * 2 + GAP) / 3),
        width: 26 - PAD * 2,
        height: (HEIGHT - PAD * 2 - GAP * 2) / 3,
      }))
    : Array.from({ length: count }, (_, i) => ({
        x: PAD + i * (BAR + GAP),
        y: PAD,
        width: BAR,
        height: HEIGHT - PAD * 2,
      }));

  return (
    <svg
      viewBox={`0 0 ${width} ${HEIGHT}`}
      // Height is fixed and width scales, so the glyphs share a baseline.
      style={{ height: "100%", width: "auto" }}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="0.5"
        y="0.5"
        width={width - 1}
        height={HEIGHT - 1}
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.45"
      />
      {bars.map((bar, i) => (
        <rect key={i} {...bar} rx="0.5" fill="currentColor" />
      ))}
    </svg>
  );
}
