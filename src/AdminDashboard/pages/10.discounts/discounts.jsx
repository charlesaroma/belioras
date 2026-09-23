/* Admin Dashboard Page: Discounts - discounts */
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { cn } from "@/utils/cn";
import { useToast } from "@/context/ToastContext";
import { useAsyncData } from "@/hooks/useAsyncData";
import IconAction from "@/AdminDashboard/components/IconAction";
import { STATUS_TONES } from "@/AdminDashboard/lib/constants";
import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  setCouponActive,
  updateCoupon,
} from "@/services/sales/couponsApi";
import CouponDialog from "./sections/CouponDialog";

function gives(coupon) {
  if (coupon.type === "free_shipping") return "Free shipping";
  if (coupon.type === "percent") return `${coupon.value}% off`;
  return `€${coupon.value} off`;
}

function statusOf(coupon) {
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    return { label: "Expired", tone: "neutral" };
  }
  return coupon.active ? { label: "Active", tone: "positive" } : { label: "Paused", tone: "pending" };
}

/**
 * Discount codes — global-only, no product or category scoping. A coupon
 * still referenced by a past order's couponCode is a historical string, not
 * a live link, so deleting one never touches order history.
 */
export default function DashDiscounts() {
  const { toast } = useToast();
  const [revision, setRevision] = useState(0);
  const refresh = () => setRevision((n) => n + 1);

  const { data: coupons, loading } = useAsyncData(getCoupons, [revision]);
  const rows = coupons ?? [];

  const [dialog, setDialog] = useState({ open: false, initial: null, n: 0 });
  const [pendingDelete, setPendingDelete] = useState(null);

  const openDialog = (initial) => setDialog((d) => ({ open: true, initial, n: d.n + 1 }));
  const closeDialog = () => setDialog((d) => ({ ...d, open: false }));

  const save = async (form) => {
    const saved = dialog.initial ? await updateCoupon(dialog.initial.id, form) : await createCoupon(form);
    closeDialog();
    refresh();
    toast(`${saved.code} ${dialog.initial ? "saved" : "added"}.`, "success");
  };

  const toggleActive = async (coupon) => {
    try {
      await setCouponActive(coupon.id, !coupon.active);
      refresh();
      toast(`${coupon.code} ${coupon.active ? "paused" : "activated"}.`, "success");
    } catch (err) {
      toast(err.message ?? "Could not update that coupon.", "error");
    }
  };

  const confirmDelete = async () => {
    const coupon = pendingDelete;
    setPendingDelete(null);
    try {
      await deleteCoupon(coupon.id);
      refresh();
      toast(`${coupon.code} deleted.`, "success");
    } catch (err) {
      toast(err.message ?? "Could not delete that coupon.", "error");
    }
  };

  if (loading) return <p className="text-[13px] text-espresso-soft">Loading…</p>;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-medium tracking-wide">Discounts</h2>
          <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-espresso-soft">
            Coupon codes shoppers redeem at checkout — percent off, a fixed amount, or free shipping,
            sitewide. Not scoped to a product or category.
          </p>
        </div>
        <Button icon={Plus} size="sm" onClick={() => openDialog(null)} className="h-10">
          Add coupon
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="border border-umber-50 bg-ivory-50 px-4 py-8 text-center text-[13px] text-espresso-soft">
          No coupons yet.
        </p>
      ) : (
        <ul className="divide-y divide-umber-50 border border-umber-50 bg-ivory-50">
          {rows.map((coupon) => {
            const status = statusOf(coupon);
            return (
              <li key={coupon.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[13px] font-semibold tracking-wide text-espresso">
                      {coupon.code}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center whitespace-nowrap px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
                        STATUS_TONES[status.tone],
                      )}
                    >
                      {status.label}
                    </span>
                  </div>
                  {coupon.description && (
                    <p className="mt-0.5 truncate text-[12px] text-espresso-soft">{coupon.description}</p>
                  )}
                </div>

                <span className="shrink-0 text-[12px] tabular-nums text-espresso-soft">
                  {gives(coupon)}
                  {coupon.minOrderValue > 0 && ` · min €${coupon.minOrderValue}`}
                  {coupon.maxDiscount && ` · capped €${coupon.maxDiscount}`}
                </span>

                <span className="shrink-0 text-[11px] uppercase tracking-[0.1em] text-espresso-soft/70">
                  {coupon.expiresAt
                    ? `Expires ${new Date(coupon.expiresAt).toLocaleDateString()}`
                    : "No expiry"}
                </span>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={coupon.active}
                    onClick={() => toggleActive(coupon)}
                    className={cn(
                      "relative h-6 w-11 shrink-0 border transition-colors",
                      coupon.active ? "border-espresso bg-espresso" : "border-umber-100 bg-ivory-50",
                    )}
                    aria-label={coupon.active ? `Pause ${coupon.code}` : `Activate ${coupon.code}`}
                  >
                    <span
                      className={cn(
                        "absolute top-[2px] size-[18px] transition-all duration-200",
                        coupon.active ? "left-[22px] bg-gold-400" : "left-[2px] bg-umber-100",
                      )}
                    />
                  </button>
                  <IconAction label={`Edit ${coupon.code}`} icon={Pencil} onClick={() => openDialog(coupon)} />
                  <IconAction
                    label={`Delete ${coupon.code}`}
                    icon={Trash2}
                    destructive
                    onClick={() => setPendingDelete(coupon)}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <CouponDialog key={dialog.n} open={dialog.open} initial={dialog.initial} onClose={closeDialog} onSave={save} />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title={`Delete ${pendingDelete?.code ?? "this coupon"}?`}
        description="Past orders that used this code keep it in their history. This only removes it from checkout."
        confirmLabel="Delete"
      />
    </section>
  );
}
