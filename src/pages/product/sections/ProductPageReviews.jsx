/* Customer Reviews */
import { useState } from "react";
import { Star } from "lucide-react";

import RatingStars from "../../../components/shared/RatingStars";
import { useCustomerAuth } from "@/context/auth/useAuthRealm";
import { useToast } from "../../../context/ToastContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { createReview, getReviews } from "../../../services/catalog/reviewsApi";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IE", { day: "numeric", month: "long", year: "numeric" });

/**
 * Reviews for this product, plus a form to leave one.
 *
 * A submission lands pending, not published — it never appears here or
 * anywhere else on the storefront until a moderator approves it, so the
 * confirmation message has to say that outright rather than let the form
 * just go quiet.
 */
export default function ProductPageReviews({ product }) {
  const { user, isAuthenticated } = useCustomerAuth();
  const { toast } = useToast();

  const { data: reviews, loading } = useAsyncData(() => getReviews(product.id), [product.id]);

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const rows = reviews ?? [];
  const count = rows.length;
  const average = count ? rows.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createReview({
        productId: product.id,
        userId: user?.id,
        rating,
        title,
        body,
        name: user?.name,
      });
      setRating(0);
      setTitle("");
      setBody("");
      setShowForm(false);
      setSubmitted(true);
      toast("Thanks — your review is awaiting approval.", "success");
    } catch (err) {
      toast(err.message ?? "Could not save your review.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-16 border-t border-umber-50 pt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-espresso">Reviews</h2>
          {count > 0 && (
            <div className="mt-1.5">
              <RatingStars rating={average} count={count} />
            </div>
          )}
        </div>

        {isAuthenticated && !showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700 underline underline-offset-4 transition-colors hover:text-gold-800"
          >
            Write a review
          </button>
        )}
      </div>

      {submitted && !showForm && (
        <p className="mt-4 border-l-2 border-gold-500 py-1 pl-3 text-[13px] text-espresso-soft">
          Thanks — your review is awaiting approval and will appear here once a moderator publishes it.
        </p>
      )}

      {showForm && (
        <form onSubmit={submit} className="mt-6 max-w-lg space-y-4 border border-umber-50 bg-brown-50/30 p-5">
          <div>
            <p className="input-label">Rating</p>
            <div className="mt-1 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} star${n === 1 ? "" : "s"}`}
                  onClick={() => setRating(n)}
                  className="text-gold-600"
                >
                  <Star className="size-6" strokeWidth={rating >= n ? 0 : 1.5} style={{ fill: "currentColor", fillOpacity: rating >= n ? 1 : 0 }} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="review-title" className="input-label">
              Title
            </label>
            <input id="review-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sum it up" />
          </div>

          <div>
            <label htmlFor="review-body" className="input-label">
              Your review
            </label>
            <textarea
              id="review-body"
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="How does it fit, feel, and wear?"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost btn-sm">
              Cancel
            </button>
            <button type="submit" disabled={!rating || submitting} className="btn btn-primary btn-sm">
              {submitting ? "Submitting…" : "Submit review"}
            </button>
          </div>
        </form>
      )}

      {!loading && rows.length === 0 && (
        <p className="mt-6 text-sm text-espresso-soft">No reviews yet for this piece.</p>
      )}

      <ul className="mt-8 space-y-6 divide-y divide-umber-50">
        {rows.map((review) => (
          <li key={review.id} className={rows[0].id === review.id ? "" : "pt-6"}>
            <div className="flex items-center gap-3">
              <RatingStars rating={review.rating} />
              {review.verified && (
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-700">
                  Verified purchase
                </span>
              )}
            </div>
            {review.title && <p className="mt-2 text-sm font-semibold text-espresso">{review.title}</p>}
            <p className="mt-1 text-sm leading-relaxed text-espresso-soft">{review.body}</p>
            <p className="mt-2 text-xs text-espresso-soft/70">
              {review.name} · {formatDate(review.date)}
            </p>

            {review.reply && (
              <div className="mt-3 border-l-2 border-gold-500 py-1 pl-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gold-700">
                  Belioras replied
                </p>
                <p className="mt-1 text-sm leading-relaxed text-espresso-soft">{review.reply.text}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
