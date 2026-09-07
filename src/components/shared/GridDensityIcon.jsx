/**
 * Grid-density glyph — N vertical bars for an N-column layout, stacked
 * horizontal bars for the single-column row layout.
 *
 * The prototype shipped these as ten PNGs in /public/icons (a default and an
 * active file for each of row/2/3/4/6). Drawing them instead means:
 *  - crisp at any zoom or pixel density, where a 26px raster is not;
 *  - one glyph for every count, so adding a 5-column option needs no new asset;
 *  - active state via currentColor and opacity rather than a second file, so it
 *    inherits the theme instead of hard-coding the palette into an image;
 *  - ten fewer network requests on the catalog page.
 */
export default function GridDensityIcon({ columns, className }) {
  const isRow = columns === "row";
  const size = 24;
  const inset = 2;
  const span = size - inset * 2;

  // Row layout reads as content stacked full width, not as one narrow column.
  const bars = isRow
    ? [0, 1, 2].map((i) => ({
        x: inset,
        y: inset + i * ((span + 2) / 3),
        width: span,
        height: (span - 4) / 3,
      }))
    : Array.from({ length: columns }, (_, i) => {
        const gap = columns > 4 ? 1.5 : 2.5;
        const barWidth = (span - gap * (columns - 1)) / columns;
        return {
          x: inset + i * (barWidth + gap),
          y: inset,
          width: barWidth,
          height: span,
        };
      });

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {bars.map((bar, i) => (
        <rect key={i} {...bar} rx="0.75" />
      ))}
    </svg>
  );
}
