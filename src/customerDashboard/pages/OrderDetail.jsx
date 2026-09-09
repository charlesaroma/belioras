import { Link, useParams } from "react-router-dom";
import { ArrowLeft, PackageX, Printer, RotateCcw } from "lucide-react";

import Button from "../../components/ui/Button";
import OrderTimeline from "../../components/account/OrderTimeline";
import StatusChip from "../../components/ui/StatusChip";
import { useAuth } from "../../context/AuthContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { getOrder } from "../../services/ordersApi";
import { getProducts } from "../../services/productsApi";

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
  const { format } = useCurrency();
  const { user } = useAuth();
  // Scoped to the signed-in customer: getOrder refuses an order that is not
  // theirs rather than trusting the id in the URL.
  const {
    data: order,
    loading,
    error,
  } = useAsyncData(() => getOrder(id, { userId: user?.id }), [id, user?.id]);

  const { data: catalog } = useAsyncData(getProducts, []);
  const { addItem } = useCart();
  const { toast } = useToast();

  const thumbnails = Object.fromEntries(
    (catalog ?? []).map((p) => [p.id, p.images?.[0]]).filter(([, src]) => src),
  );

  // The fixtures record a coupon code but no discount amount, so it is what
  // the totals do not otherwise account for.
  const discount = order
    ? Math.max(
        0,
        (order.subtotal ?? 0) + (order.shipping ?? 0) + (order.tax ?? 0) - (order.total ?? 0),
      )
    : 0;

  /**
   * Put this order back in the bag.
   *
   * Resolves each line against the live catalogue rather than trusting the
   * order: a piece may have been withdrawn or sold out since, and saying so is
   * more useful than silently adding four of six things.
   */
  const orderAgain = () => {
    if (!catalog) return;
    const missing = [];
    let added = 0;

    for (const item of order.items ?? []) {
      const product = catalog.find((p) => p.id === item.productId);
      if (!product || product.stock <= 0) {
        missing.push(item.name);
        continue;
      }
      if (addItem(product, { size: item.size, color: item.color, quantity: item.quantity })) {
        added += 1;
      } else {
        missing.push(item.name);
      }
    }

    if (added === 0) {
      toast("None of these pieces are available at the moment.", "warning");
      return;
    }
    toast(
      missing.length
        ? `${added} added. Unavailable: ${missing.join(", ")}.`
        : `${added} ${added === 1 ? "piece" : "pieces"} added to your bag.`,
      missing.length ? "warning" : "success",
    );
  };

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

      <OrderTimeline status={order.status} />

      <div className="no-print flex flex-wrap gap-3">
        <Button icon={RotateCcw} onClick={orderAgain} disabled={!catalog}>
          Order again
        </Button>
        <Button variant="secondary" icon={Printer} onClick={() => window.print()}>
          Receipt
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-umber-50 bg-white">
        <ul className="divide-y divide-umber-50">
          {order.items.map((item) => (
            <li key={`${item.productId}-${item.size}-${item.color}`} className="flex items-start gap-4 px-5 py-4 sm:px-6">
              {/* The piece itself. This was a letter tile — the first
                  character of the product name in a coloured square — because
                  order items carry no image; it is resolved by productId. */}
              <Link
                to={`/product/${item.slug ?? item.productId}`}
                className="block size-16 shrink-0 overflow-hidden rounded-xl border border-umber-50"
                aria-label={item.name}
              >
                {thumbnails[item.productId] ? (
                  <img
                    src={thumbnails[item.productId]}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center bg-gold-500/15 text-lg font-medium text-gold-700">
                    {item.name.charAt(0)}
                  </span>
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  to={`/product/${item.slug ?? item.productId}`}
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
                {format(item.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>
        <dl className="space-y-2 border-t border-umber-50 px-5 py-5 sm:px-6">
          <TotalRow label="Subtotal" amount={format(order.subtotal)} />
          <TotalRow label="Shipping" amount={format(order.shipping)} />
          <TotalRow label="Tax" amount={format(order.tax)} />
          {/* This printed format(order.total) — the order total — beside the
              coupon label, so a discount line showed what was actually paid.
              Derived from the parts, since the fixtures carry no discount
              field, and hidden when it comes to nothing. */}
          {order.couponCode && discount > 0 ? (
            <TotalRow label={`Coupon ${order.couponCode}`} amount={`−${format(discount)}`} />
          ) : null}
          <div className="flex items-center justify-between border-t border-umber-50 pt-3">
            <dt className="font-display text-base font-medium tracking-wide">Total</dt>
            <dd className="font-display text-xl font-semibold">{format(order.total)}</dd>
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