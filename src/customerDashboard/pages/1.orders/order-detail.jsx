import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Printer, RotateCcw } from "lucide-react";

import Button from "../../../components/ui/Button";
import OrderTimeline from "../../../components/account/OrderTimeline";
import StatusChip from "../../../components/ui/StatusChip";
import { useAuth } from "../../../context/AuthContext";
import { useCurrency } from "../../../context/CurrencyContext";
import { useCart } from "../../../context/CartContext";
import { useToast } from "../../../context/ToastContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getOrder } from "../../../services/ordersApi";
import { getProducts } from "../../../services/productsApi";

import OrderLines from "./sections/OrderDetailLines";
import { OrderNotFound, OrderSkeleton } from "./sections/OrderDetailStates";
import { discountOn, reorder } from "./sections/orderDetailActions";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IE", { day: "numeric", month: "long", year: "numeric" });

/**
 * One order: where it is, what was in it, and what it cost.
 *
 * Scoped to the signed-in customer — getOrder refuses an order that is not
 * theirs rather than trusting the id in the URL.
 */
export default function OrderDetail() {
  const { id } = useParams();
  const { format } = useCurrency();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();

  const {
    data: order,
    loading,
    error,
  } = useAsyncData(() => getOrder(id, { userId: user?.id }), [id, user?.id]);

  const { data: catalog } = useAsyncData(getProducts, []);

  const thumbnails = Object.fromEntries(
    (catalog ?? []).map((p) => [p.id, p.images?.[0]]).filter(([, src]) => src),
  );

  if (loading) return <OrderSkeleton />;
  if (error || !order) return <OrderNotFound />;

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
        <Button
          icon={RotateCcw}
          onClick={() => reorder({ order, catalog, addItem, toast })}
          disabled={!catalog}
        >
          Order again
        </Button>
        <Button variant="secondary" icon={Printer} onClick={() => window.print()}>
          Receipt
        </Button>
      </div>

      <OrderLines
        order={order}
        thumbnails={thumbnails}
        format={format}
        discount={discountOn(order)}
      />

      {order.shippingAddress ? (
        <div className="rounded-2xl border border-umber-50 bg-white p-5 sm:p-6">
          <h2 className="font-display text-lg font-medium tracking-wide">Delivery address</h2>
          <p className="mt-2 text-sm leading-relaxed text-espresso-soft">{order.shippingAddress}</p>
        </div>
      ) : null}
    </div>
  );
}
