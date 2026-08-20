import { BadgeCheck, Quote } from "lucide-react";

import RatingStars from "../../../components/shared/RatingStars";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getRecentReviews } from "../../../services/reviewsApi";

export default function TestimonialsSection() {
  const { data: reviews = [], loading } = useAsyncData(getRecentReviews, []);

  return (
    <section
      aria-labelledby="testimonials-title"
      className="container-main py-section-mobile md:py-section-desktop"
    >
      <div className="mb-10 text-center">
        <p className="eyebrow">Client Love</p>
        <h2
          id="testimonials-title"
          className="mt-3 font-display text-3xl tracking-wide text-espresso md:text-4xl"
        >
          Worn with joy, kept for years
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {(loading ? Array.from({ length: 3 }).map(() => ({})) : reviews).map((review, i) =>
          review?.id ? (
            <figure
              key={review.id}
              className="flex flex-col rounded-lg border border-umber-100 bg-ivory-50 p-7"
            >
              <Quote className="size-7 text-gold-600" aria-hidden="true" />
              <RatingStars rating={review.rating} className="mt-4" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-espresso-soft">
                “{review.body}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-gold-600/10 text-sm font-semibold text-gold-700">
                  {review.name.charAt(0)}
                </span>
                <span className="text-sm font-medium text-espresso">
                  {review.name}
                  {review.verified && (
                    <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-gold-700">
                      <BadgeCheck className="size-3.5" aria-hidden="true" /> Verified
                    </span>
                  )}
                </span>
              </figcaption>
            </figure>
          ) : (
            <div key={i} className="skeleton h-56 rounded-lg" aria-hidden="true" />
          )
        )}
      </div>
    </section>
  );
}