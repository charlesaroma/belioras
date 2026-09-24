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
  couponStats,
  createCoupon,
  deleteCoupon,
  getCoupons,
  setCouponActive,
  updateCoupon,
} from "@/services/sales/couponsApi";
import { useCurrency } from "@/context/CurrencyContext";
import CouponDialog from "./sections/CouponDialog";
import DiscountsSummary from "./sections/DiscountsSummary";

function gives(coupon) {
  if (coupon.type === "free_shipping") return "Free shipping";
  if (coupon.type === "percent") return `${coupon.value}% off`;
  return `€${coupon.value} off`;
}

function statusOf(coupon, used = 0) {
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    return { label: "Expired", tone: "neutral" };
  }
  if (coupon.maxUses && used >= coupon.maxUses) return { label: "Fully redeemed", tone: "neutral" };
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
  const { data: stats, loading: statsLoading } = useAsyncData(couponStats, [revision]);
  const { format } = useCurrency();
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

      <DiscountsSummary stats={stats} loading={statsLoading} activeCodes={rows.filter((c) => c.active).length} />

      {rows.length === 0 ? (
        <p className="border border-umber-50 bg-ivory-50 px-4 py-8 text-center text-[13px] text-espresso-soft">
          No coupons yet.
        </p>
      ) : (
        <ul className="divide-y divide-umber-50 border border-umber-50 bg-ivory-50">
          {rows.map((coupon) => {
            const code = coupon.code.toUpperCase();
            const mine = stats?.byCode?.[code] ?? { orders: 0, customers: 0, revenue: 0, discount: 0 };
            const status = statusOf(coupon, mine.orders);
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
                  <p className="mt-0.5 text-[11px] tabular-nums text-espresso-soft/70">
                    {mine.orders === 0
                      ? "Not yet used"
                      : [
                          `${mine.orders} ${mine.orders === 1 ? "order" : "orders"}`,
                          `${mine.customers} ${mine.customers === 1 ? "customer" : "customers"}`,
                          `${format(mine.revenue)} revenue`,
                          coupon.type === "free_shipping" ? "shipping waived" : `${format(mine.discount)} discounted`,
                        ].join(" · ")}
                  </p>
                  <p className="mt-0.5 text-[11px] text-espresso-soft/70">
                    {coupon.maxUses ? `${mine.orders} of ${coupon.maxUses} uses taken` : "Unlimited uses"}
                    {coupon.maxUsesPerCustomer
                      ? ` · ${coupon.maxUsesPerCustomer === 1 ? "one use" : `${coupon.maxUsesPerCustomer} uses`} per customer`
                      : ""}
                  </p>
                  {coupon.maxUses > 0 && (
                    <span aria-hidden="true" className="mt-1.5 block h-1 w-40 max-w-full bg-umber-50">
                      <span
                        className="block h-full bg-gold-500"
                        style={{ width: `${Math.min(100, (mine.orders / coupon.maxUses) * 100)}%` }}
                      />
                    </span>
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
                        "absolute left-[2px] top-[2px] size-[18px] transition-[translate,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
                        coupon.active ? "translate-x-5 bg-gold-400" : "translate-x-0 bg-umber-100",
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
