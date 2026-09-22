/**
 * A reference photo for "how to measure", replacing the earlier line-drawing
 * figure with an actual photo — the instructions beside it (see
 * SizeChartHowTo) already name Shoulder, Bust, Waist, Hip and Inside leg in
 * words, so nothing here needs to point at them pixel-for-pixel.
 */
export default function SizeChartFigure({ className = "" }) {
  return (
    <img
      src="https://images.unsplash.com/photo-1699787167971-db840f61c3bd?q=80&w=400&auto=format&fit=crop"
      alt="A woman standing, for reference when taking your own measurements"
      loading="lazy"
      className={`aspect-[2/3] w-full max-w-[220px] rounded-sm border border-umber-50 object-cover ${className}`}
    />
  );
}
