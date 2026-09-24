/* Customer Dashboard Page: Orders - order-detail */
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Printer, RotateCcw, X } from "lucide-react";

import Button from "../../../components/ui/Button";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import OrderTimeline from "../../../components/account/OrderTimeline";
import StatusChip from "../../../components/ui/StatusChip";
import { useCustomerAuth } from "@/context/auth/useAuthRealm";
import { useCurrency } from "../../../context/CurrencyContext";
import { useCart } from "../../../context/CartContext";
import { useToast } from "../../../context/ToastContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getOrder, updateOrderStatus } from "../../../services/sales/ordersApi";
import { getAllProducts } from "../../../services/catalog/productsApi";
import { getTaxonomy } from "../../../services/catalog/navigationApi";
import { isOffTimeline, nextStatuses, normalizeStatus } from "../../../utils/orderStatus";

import OrderLines from "./sections/OrderDetailLines";
import { OrderNotFound, OrderSkeleton } from "./sections/OrderDetailStates";
import { discountOn, reorder } from "./sections/orderDetailActions";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IE", { day: "numeric", month: "long", year: "numeric" });

export default function OrderDetail() {
  const { id } = useParams();
  const { format } = useCurrency();
  const { user } = useCustomerAuth();
  const { addItem, openCart } = useCart();
  const { toast } = useToast();

  const [revision, setRevision] = useState(0);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const {
    data: order,
    loading,
    error,
  } = useAsyncData(() => getOrder(id, { userId: user?.id }), [id, user?.id, revision]);

  const { data: catalog } = useAsyncData(getAllProducts, []);
  const { data: taxonomy } = useAsyncData(getTaxonomy, []);

  const thumbnails = Object.fromEntries(
    (catalog ?? []).map((p) => [p.id, p.images?.[0]]).filter(([, src]) => src),
  );

  if (loading) return <OrderSkeleton />;
  if (error || !order) return <OrderNotFound />;

  // Cancellation is only ever offered pre-shipment — nothing was deducted
  // from stock yet, so there is nothing to restock on the way out.
  const canCancel =
    ["to-pay", "to-ship"].includes(normalizeStatus(order.status)) &&
    nextStatuses(order.status).includes("cancelled");

  const confirmCancel = async () => {
    setCancelling(true);
    try {
      await updateOrderStatus(order.id, "cancelled", { by: user?.name ?? "Customer" });
      setCancelOpen(false);
      setRevision((n) => n + 1);
      toast("Order cancelled.", "success");
    } catch (err) {
      toast(err.message ?? "Could not cancel that order.", "error");
    } finally {
      setCancelling(false);
    }
  };

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

      {order.trackingRef && (
        <p className="text-sm text-espresso-soft">
          {order.carrier && `${order.carrier} — `}
          Carrier reference <strong className="text-espresso">{order.trackingRef}</strong>
        </p>
      )}

      {isOffTimeline(order.status) && (
        <p className="text-sm text-espresso-soft">
          {normalizeStatus(order.status) === "refunded"
            ? "This order was refunded. The amount is back with your bank, which can take a few working days to show."
            : "This order was cancelled."}{" "}
          If that is unexpected, write to{" "}
          <a href="mailto:support@belioras.com" className="text-gold-700 underline underline-offset-4">
            support@belioras.com
          </a>
          .
        </p>
      )}

      <div className="no-print flex flex-wrap gap-3">
        <Button
          icon={RotateCcw}
          onClick={() => reorder({ order, catalog, addItem, toast, openCart })}
          disabled={!catalog}
        >
          Order again
        </Button>
        <Button variant="secondary" icon={Printer} onClick={() => window.print()}>
          Receipt
        </Button>
        {canCancel && (
          <Button variant="ghost" icon={X} onClick={() => setCancelOpen(true)}>
            Cancel order
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={confirmCancel}
        loading={cancelling}
        title="Cancel this order?"
        description="This can't be undone from here. If you've changed your mind afterwards, write to support@belioras.com."
        confirmLabel="Cancel order"
        cancelLabel="Keep order"
      />

      <OrderLines
        order={order}
        thumbnails={thumbnails}
        taxonomy={taxonomy}
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
