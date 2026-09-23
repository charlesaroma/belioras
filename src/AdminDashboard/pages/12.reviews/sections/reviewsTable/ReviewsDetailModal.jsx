/* Admin Dashboard Page: Reviews - ReviewsDetailModal */
import { useState } from "react";

import Modal from "../../../../../components/common/Modal";
import Button from "../../../../../components/ui/Button";
import RatingStars from "../../../../../components/shared/RatingStars";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IE", { day: "numeric", month: "long", year: "numeric" });

export default function ReviewsDetailModal({ review, productName, onClose, onPublish, onHide, onReply }) {
  const [reply, setReply] = useState(review?.reply?.text ?? "");
  const [saving, setSaving] = useState(false);

  const saveReply = async () => {
    setSaving(true);
    try {
      await onReply(reply);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={Boolean(review)} onClose={onClose} title={productName ?? review?.productId ?? "Review"} width="max-w-lg">
      {review && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <RatingStars rating={review.rating} />
            {review.verified && (
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-700">
                Verified purchase
              </span>
            )}
          </div>

          <div>
            {review.title && <p className="text-sm font-semibold text-espresso">{review.title}</p>}
            <p className="mt-1 text-sm leading-relaxed text-espresso-soft">{review.body}</p>
            <p className="mt-2 text-xs text-espresso-soft/70">
              {review.name} · {formatDate(review.date)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-umber-50 pt-4">
            {review.status !== "published" && (
              <Button size="sm" onClick={onPublish}>
                Publish
              </Button>
            )}
            {review.status !== "hidden" && (
              <Button size="sm" variant="ghost" onClick={onHide}>
                Hide
              </Button>
            )}
          </div>

          <div className="border-t border-umber-50 pt-4">
            <label htmlFor="review-reply" className="input-label">
              Your reply
            </label>
            <textarea
              id="review-reply"
              rows={3}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Shown publicly under this review."
            />
            <div className="mt-2 flex justify-end">
              <Button size="sm" loading={saving} onClick={saveReply} className="bg-espresso text-ivory-50 hover:bg-espresso-600">
                {review.reply ? "Update reply" : "Post reply"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
