import { useState } from "react";
import { Loader2, Tag, X } from "lucide-react";

import { useCurrency } from "../../../context/CurrencyContext";
import { validateCoupon } from "../../../services/couponsApi";
import { cn } from "../../../utils/cn";

/**
 * What is in the bag and what it costs.
 *
 * The coupon field lives here rather than beside the address, because a
 * discount is a fact about the total and belongs where the total is read.
 *
 * VAT is shown as a component of the total, not a line added to it — the
 * prices already include it. See utils/checkout.js.
 *
 * The coupon control is a div, not a form. This renders inside the checkout
 * form, and a nested form is invalid HTML: the browser drops the inner one, so
 * its submit button silently becomes a submit button for the outer form. That
 * made "Apply" place the order and made the coupon never apply at all.
 */
export default function OrderSummary({ items, totals, coupon, onCoupon, disabled }) {
  const { format } = useCurrency();
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const apply = async () => {
    if (!code.trim()) return;
    setChecking(true);
    setError("");
    try {
      const valid = await validateCoupon(code, totals.subtotal);
      onCoupon(valid);
      setCode("");
    } catch (err) {
      setError(err.message ?? "That code is not valid.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <aside className="border border-umber-50 bg-ivory-50 p-6">
      <h2 className="font-display text-xl tracking-wide text-espresso">Your order</h2>

      <ul className="mt-5 space-y-4 border-b border-umber-50 pb-5">
        {items.map((item) => (
          <li key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
            <img
              src={item.image}
              alt=""
              className="size-16 shrink-0 border border-umber-50 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] text-espresso">{item.name}</p>
              <p className="mt-0.5 text-[11px] text-espresso-soft">
                {[item.size && `Size ${item.size}`, item.color, `Qty ${item.quantity}`]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            <span className="shrink-0 text-[13px] tabular-nums text-espresso">
              {format(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      {coupon ? (
        <div className="mt-5 flex items-center justify-between gap-3 border border-gold-500/40 bg-gold-500/5 px-3 py-2">
          <span className="flex min-w-0 items-center gap-2 text-[12px] text-espresso">
            <Tag className="size-3.5 shrink-0 text-gold-700" aria-hidden="true" />
            <span className="truncate font-medium">{coupon.code}</span>
          </span>
          <button
            type="button"
            onClick={() => onCoupon(null)}
            aria-label={`Remove coupon ${coupon.code}`}
            className="shrink-0 text-espresso/40 transition-colors hover:text-error"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div className="mt-5">
          <label htmlFor="coupon" className="input-label">
            Discount code
          </label>
          <div className="flex gap-2">
            <input
              id="coupon"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="WELCOME10"
              disabled={disabled}
              onKeyDown={(e) => {
                // Enter applies the code rather than submitting the order.
                if (e.key === "Enter") {
                  e.preventDefault();
                  apply();
                }
              }}
              className="input flex-1 uppercase"
            />
            <button
              type="button"
              onClick={apply}
              disabled={disabled || checking || !code.trim()}
              className="btn btn-md btn-secondary shrink-0"
            >
              {checking && <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />}
              Apply
            </button>
          </div>
          {error && (
            <p role="alert" className="input-helper mt-1.5 text-error">
              {error}
            </p>
          )}
        </div>
      )}

      <dl className="mt-6 space-y-2 border-t border-umber-50 pt-5 text-[13px]">
        <Row label="Subtotal" value={format(totals.subtotal)} />
        {totals.discount > 0 && (
          <Row label="Discount" value={`−${format(totals.discount)}`} accent />
        )}
        <Row
          label={`Shipping · ${totals.zone.label ?? "Standard"}`}
          value={totals.qualifiesFree ? "Complimentary" : format(totals.shipping)}
          accent={totals.qualifiesFree}
        />

        {totals.freeShippingGap != null && totals.freeShippingGap > 0 && (
          <p className="pt-1 text-[11px] text-espresso-soft">
            {format(totals.freeShippingGap)} more for complimentary shipping.
          </p>
        )}

        <div className="flex items-baseline justify-between border-t border-umber-50 pt-3">
          <dt className="font-display text-base tracking-wide text-espresso">Total</dt>
          <dd className="font-display text-xl tabular-nums text-espresso">
            {format(totals.total)}
          </dd>
        </div>

        {/* A component of the total, not a line added to it. */}
        <p className="text-[11px] text-espresso-soft">Includes {format(totals.tax)} VAT</p>
      </dl>
    </aside>
  );
}

function Row({ label, value, accent = false }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-espresso-soft">{label}</dt>
      <dd className={cn("tabular-nums", accent ? "text-gold-700" : "text-espresso")}>{value}</dd>
    </div>
  );
}
