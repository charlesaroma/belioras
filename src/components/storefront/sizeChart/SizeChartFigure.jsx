/**
 * A reference photo for "how to measure", replacing the earlier line-drawing
 * figure. Belioras' own photo — the shoulder, bust, waist, hip and inside leg
 * labels are drawn onto the image itself, so nothing needs to be overlaid.
 */
export default function SizeChartFigure({ className = "" }) {
  return (
    <img
      src="https://ik.imagekit.io/sbgenu6wj/Belioras/image.png"
      alt="A woman standing, labelled with where to measure the shoulder, bust, waist, hip and inside leg"
      loading="lazy"
      className={`h-auto w-full max-w-[220px] object-contain ${className}`}
    />
  );
}
