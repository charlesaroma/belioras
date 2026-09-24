/* Admin Dashboard Page: Reviews - reviews */
import { useMemo, useState } from "react";

import { useToast } from "@/context/ToastContext";
import { useAsyncData } from "@/hooks/useAsyncData";
import { STATUS_TONES } from "@/AdminDashboard/lib/constants";
import { cn } from "@/utils/cn";
import { getAllProducts } from "@/services/catalog/productsApi";
import { getAllReviews, hideReview, publishReview, replyToReview } from "@/services/catalog/reviewsApi";
import RatingStars from "@/components/shared/RatingStars";
import ReviewsDetailModal from "./sections/reviewsTable/ReviewsDetailModal";

const TABS = [
  ["all", "All"],
  ["pending", "Pending"],
  ["published", "Published"],
  ["hidden", "Hidden"],
];

const STATUS_LABEL = { pending: "Pending", published: "Published", hidden: "Hidden" };
const STATUS_TONE = { pending: "pending", published: "positive", hidden: "neutral" };

export default function DashReviews() {
  const { toast } = useToast();
  const [revision, setRevision] = useState(0);
  const refresh = () => setRevision((n) => n + 1);

  const { data: reviews, loading } = useAsyncData(getAllReviews, [revision]);
  const { data: products } = useAsyncData(getAllProducts, []);

  const productName = useMemo(() => {
    const map = new Map((products ?? []).map((p) => [p.id, p.name]));
    return (id) => map.get(id) ?? id;
  }, [products]);

  const [tab, setTab] = useState("all");
  const [viewing, setViewing] = useState(null);

  const rows = reviews ?? [];
  const visible = tab === "all" ? rows : rows.filter((r) => r.status === tab);
  const tabs = TABS.map(([value, label]) => ({
    value,
    label,
    count: value === "all" ? rows.length : rows.filter((r) => r.status === value).length,
  }));

  const withToast = async (fn, message) => {
    try {
      const updated = await fn();
      refresh();
      setViewing((v) => (v ? updated : v));
      toast(message, "success");
    } catch (err) {
      toast(err.message ?? "Could not update that review.", "error");
    }
  };

  if (loading) return <p className="text-[13px] text-espresso-soft">Loading…</p>;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-medium tracking-wide">Reviews</h2>
        <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-espresso-soft">
          Every submission lands here pending — nothing shows on a product page until you publish it.
        </p>
      </div>

      <div role="tablist" aria-label="Reviews by status" className="inline-flex border border-umber-50 bg-ivory-50">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={tab === t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "flex items-center gap-1.5 border-r border-umber-50 px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] transition-colors last:border-r-0",
              tab === t.value ? "bg-espresso text-ivory-50" : "text-espresso-soft hover:bg-brown-50/60 hover:text-espresso",
            )}
          >
            {t.label}
            <span className={cn("tabular-nums", tab === t.value ? "opacity-60" : "opacity-45")}>{t.count}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="border border-umber-50 bg-ivory-50 px-4 py-8 text-center text-[13px] text-espresso-soft">
          No reviews here.
        </p>
      ) : (
        <ul className="divide-y divide-umber-50 border border-umber-50 bg-ivory-50">
          {visible.map((review) => (
            <li key={review.id}>
              <button
                type="button"
                onClick={() => setViewing(review)}
                className="flex w-full flex-wrap items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-brown-50/40"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-espresso">{productName(review.productId)}</span>
                  <span className="mt-0.5 flex items-center gap-2">
                    <RatingStars rating={review.rating} />
                    {review.title && <span className="truncate text-[12px] text-espresso-soft">{review.title}</span>}
                  </span>
                </span>

                <span className="shrink-0 text-[12px] text-espresso-soft">{review.name}</span>

                <span
                  className={cn(
                    "shrink-0 whitespace-nowrap px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
                    STATUS_TONES[STATUS_TONE[review.status]],
                  )}
                >
                  {STATUS_LABEL[review.status] ?? review.status}
                </span>

                <span className="shrink-0 text-[11px] text-espresso-soft/70">{review.date}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <ReviewsDetailModal
        review={viewing}
        productName={viewing ? productName(viewing.productId) : null}
        onClose={() => setViewing(null)}
        onPublish={() => withToast(() => publishReview(viewing.id), "Review published.")}
        onHide={() => withToast(() => hideReview(viewing.id), "Review hidden.")}
        onReply={(text) => withToast(() => replyToReview(viewing.id, text), text ? "Reply posted." : "Reply removed.")}
      />
    </section>
  );
}
