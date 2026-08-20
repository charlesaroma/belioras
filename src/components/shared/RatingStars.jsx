import { Star } from "lucide-react";

export default function RatingStars({ rating = 0, count, className = "" }) {
  const value = Number(rating) || 0;
  const reviews = count != null ? ` · ${count} review${count === 1 ? "" : "s"}` : "";

  return (
    <span
      role="img"
      aria-label={`Rated ${value.toFixed(1)} out of 5 stars${reviews}`}
      className={`inline-flex items-center gap-1.5 ${className}`}
    >
      <span aria-hidden="true" className="inline-flex items-center gap-0.5 text-gold-600">
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.max(0, Math.min(1, value - (i - 1)));
          return (
            <Star
              key={i}
              className="size-3.5"
              strokeWidth={fill > 0 ? 0 : 1.5}
              style={{ fill: "currentColor", fillOpacity: fill }}
            />
          );
        })}
      </span>
      {count != null && (
        <span aria-hidden="true" className="text-xs tabular-nums text-espresso-soft">
          ({count})
        </span>
      )}
    </span>
  );
}