/* Admin Dashboard Page: Orders - OrdersAttention */
import { CreditCard, Truck } from "lucide-react";

import { cn } from "@/utils/cn";

function Card({ icon: Icon, tone, eyebrow, title, detail, detailTone, action }) {
  return (
    <div className="flex items-center gap-4 border border-umber-50 bg-ivory-50 p-5">
      <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-full", tone)}>
        <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-espresso-soft">{eyebrow}</p>
        <p className="mt-1 font-display text-2xl leading-tight text-espresso">{title}</p>
        {detail && <p className={cn("mt-1 text-[12px] leading-snug", detailTone ?? "text-espresso-soft")}>{detail}</p>}
      </div>
      {action}
    </div>
  );
}

const reviewButton = (onClick) => (
  <button type="button" onClick={onClick} className="shrink-0 border border-espresso px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-espresso transition-colors hover:bg-espresso hover:text-ivory-50">
    Review
  </button>
);

/**
 * What needs someone today, above the list: parcels to send, and payments
 * still with the payment provider.
 */
export default function OrdersAttention({ rows, format, onReview }) {
  const toShip = rows.filter((r) => r.status === "to-ship");
  const oldestShip = Math.max(0, ...toShip.map((r) => r.age));
  const toPay = rows.filter((r) => r.status === "to-pay");
  const owed = toPay.reduce((s, r) => s + (r.total ?? 0), 0);
  const staleUnpaid = toPay.filter((r) => r.age > 30).length;
  const failed = toPay.filter((r) => r.payment === "failed").length;

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <Card
        icon={Truck}
        tone="bg-gold-500/15 text-gold-800"
        eyebrow="To ship"
        title={`${toShip.length} ${toShip.length === 1 ? "order" : "orders"}`}
        detail={toShip.length ? `Oldest has waited ${oldestShip} ${oldestShip === 1 ? "day" : "days"}` : "Nothing waiting to go out"}
        detailTone={oldestShip > 3 ? "text-gold-800" : undefined}
        action={toShip.length > 0 && reviewButton(() => onReview("to-ship"))}
      />
      <Card
        icon={CreditCard}
        tone="bg-umber-50 text-espresso-soft"
        eyebrow="Payment pending"
        title={format(owed)}
        detail={
          toPay.length
            ? `${toPay.length} ${toPay.length === 1 ? "order" : "orders"}${failed ? ` · ${failed} failed` : ""}${staleUnpaid ? ` · ${staleUnpaid} over a month old` : ""}. Confirmed automatically by the payment provider.`
            : "Nothing waiting on the payment provider"
        }
        action={toPay.length > 0 && reviewButton(() => onReview("to-pay"))}
      />
    </div>
  );
}
