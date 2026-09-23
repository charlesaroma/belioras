const DEFAULT_SRC = "https://ik.imagekit.io/sbgenu6wj/Belioras/image.png";

/**
 * A reference photo for "how to measure" — dashboard-editable
 * (Sizes & Guides > Dresses sizing), so the shop can swap in its own photo
 * without a code change. Falls back to the shipped photo when none is set.
 */
export default function SizeChartFigure({ src, className = "" }) {
  // An explicit empty string means the shop chose to show nothing; a missing
  // prop (an older caller not yet updated) falls back to the shipped photo.
  const resolved = src === undefined ? DEFAULT_SRC : src;
  if (!resolved) return null;

  return (
    <img
      src={resolved}
      alt="A woman standing, labelled with where to measure the shoulder, bust, waist, hip and inside leg"
      loading="lazy"
      className={`h-auto w-full max-w-[220px] object-contain ${className}`}
    />
  );
}
