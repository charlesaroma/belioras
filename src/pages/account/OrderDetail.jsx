import { Link, useParams } from "react-router-dom";
import { ArrowLeft, PackageX } from "lucide-react";

import { useCurrency } from "../../context/CurrencyContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { formatCurrency } from "../../utils/formatCurrency";
import { getOrder } from "../../services/ordersApi";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-800",
  processing: "bg-sky-50 text-sky-800",
  shipped: "bg-sky-50 text-sky-800",
  delivered: "bg-emerald-50 text-emerald-800",
  cancelled: "bg-rose-50 text-rose-700",
  refunded: "bg-rose-50 text-rose-700",
};

function StatusChip({ status }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[status] ?? "bg-brown-50 text-gold-700"}`}
    >
      {label}
    </span>
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IE", { day: "numeric", month: "long", year: "numeric" });
}

function TotalRow({ label, amount, bold = false }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "text-base font-semibold text-espresso" : "text-sm text-espresso-soft"}`}>
      <dt>{label}</dt>
      <dd className={bold ? "font-semibold text-espresso" : ""}>{amount}</dd>
    </div>
  );
}

export default function OrderDetail() {
  const { id } = useParams();
  const { currency, convert } = useCurrency();
  const { data: order, loading, error } = useAsyncData(() => getOrder(id), [id]);

  if (loading) {
    return (
      <div className="space-y-6" aria-hidden="true">
        <div className="h-4 w-40 animate-pulse rounded bg-brown-50" />
        <div className="animate-pulse rounded-2xl border border-umber-50 bg-white p-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="mb-4 flex gap-4">
              <div className="size-16 rounded-xl bg-brown-50" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 rounded bg-brown-50" />
                <div className="h-3 w-1/3 rounded bg-brown-50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-2xl border border-umber-50 bg-white px-6 py-16 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-rose-50 text-rose-700">
          <PackageX className="size-6" aria-hidden="true" />
        </span>
        <h2 className="mt-5 font-display text-xl font-medium tracking-wide">Order not found</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-espresso-soft">
          We could not find this order. It may have been removed, or the link may be incorrect.
        </p>
        <Link
          to="/account/orders"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 text-sm font-medium text-ivory-50 transition-colors duration-200 hover:bg-umber-500 active:scale-[0.98]"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/account/orders"
          className="inline-flex items-center gap-1.5 text-sm text-espresso-soft transition-colors hover:text-gold-700"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          All orders
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <h1 className="font-display text-2xl font-medium tracking-wide">{order.id}</h1>
          <StatusChip status={order.status} />
        </div>
        <p className="mt-1 text-sm text-espresso-soft">Placed {formatDate(order.createdAt)}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-umber-50 bg-white">
        <ul className="divide-y divide-umber-50">
          {order.items.map((item) => (
            <li key={`${item.productId}-${item.size}-${item.color}`} className="flex items-start gap-4 px-5 py-4 sm:px-6">
              <Link
                to={`/product/${item.slug}`}
                className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gold-500/15 text-lg font-medium text-gold-700"
                aria-label={item.name}
              >
                {item.name.charAt(0)}
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  to={`/product/${item.slug}`}
                  className="text-sm font-medium text-espresso transition-colors hover:text-gold-700"
                >
                  {item.name}
                </Link>
                <p className="mt-0.5 text-xs text-espresso-soft">
                  Qty {item.quantity}
                  {item.size ? ` · Size ${item.size}` : ""}
                  {item.color ? ` · ${item.color}` : ""}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-espresso">
                {formatCurrency(convert(item.price * item.quantity), currency)}
              </p>
            </li>
          ))}
        </ul>
        <dl className="space-y-2 border-t border-umber-50 px-5 py-5 sm:px-6">
          <TotalRow label="Subtotal" amount={formatCurrency(convert(order.subtotal), currency)} />
          <TotalRow label="Shipping" amount={formatCurrency(convert(order.shipping), currency)} />
          <TotalRow label="Tax" amount={formatCurrency(convert(order.tax), currency)} />
          {order.couponCode ? (
            <TotalRow label={`Coupon ${order.couponCode}`} amount={formatCurrency(convert(order.total), currency)} />
          ) : null}
          <div className="flex items-center justify-between border-t border-umber-50 pt-3">
            <dt className="font-display text-base font-medium tracking-wide">Total</dt>
            <dd className="font-display text-xl font-semibold">{formatCurrency(convert(order.total), currency)}</dd>
          </div>
        </dl>
      </div>

      {order.shippingAddress ? (
        <div className="rounded-2xl border border-umber-50 bg-white p-5 sm:p-6">
          <h2 className="font-display text-lg font-medium tracking-wide">Delivery address</h2>
          <p className="mt-2 text-sm leading-relaxed text-espresso-soft">{order.shippingAddress}</p>
        </div>
      ) : null}
    </div>
  );
}