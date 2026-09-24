/* Admin Dashboard Page: Orders - OrdersDetailModal */
import { FileText, Mail, Send } from "lucide-react";

import { EMAIL_TYPES, emailsForOrder } from "../../../../../services/notifications/emailsApi";

import Button from "../../../../../components/ui/Button";
import StatusChip from "../../../../../components/ui/StatusChip";
import Modal from "../../../../../components/common/Modal";
import { ORDER_STATUS, nextStatuses } from "../../../../../utils/orderStatus";
import OrdersPayments from "./OrdersPayments";

export default function OrderDetailModal({
  order,
  onClose,
  onAdvance,
  format,
  dateFmt,
  showPayments = false,
  canEdit = true,
  onSendReceipt,
  onCancel,
  onRefund,
}) {

  const transitions = order ? nextStatuses(order.status) : [];

  return (
    <Modal open={Boolean(order)} onClose={onClose} title={order?.id ?? "Order"} width="max-w-2xl">
      {order && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-umber-50 pb-4">
            <div>
              <p className="text-[14px] text-espresso">{order.name ?? "Guest"}</p>
              <p className="text-[12px] text-espresso-soft">{order.email ?? "—"}</p>
            </div>
            <div className="text-right">
              <StatusChip status={order.status} />
              <p className="mt-1.5 text-[11px] text-espresso-soft">
                {dateFmt.format(new Date(order.createdAt))}
              </p>
            </div>
          </div>

          <ul className="space-y-3">
            {(order.items ?? []).map((item, i) => (
              <li
                key={`${item.productId}-${item.size ?? ""}-${item.color ?? ""}-${i}`}
                className="flex items-start justify-between gap-4 text-[13px]"
              >
                <div className="min-w-0">
                  <p className="truncate text-espresso">{item.name}</p>
                  <p className="text-[11px] text-espresso-soft">
                    {[item.size && `Size ${item.size}`, item.color, `Qty ${item.quantity ?? 1}`]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <span className="shrink-0 tabular-nums text-espresso">
                  {format((item.price ?? 0) * (item.quantity ?? 1))}
                </span>
              </li>
            ))}
          </ul>

          <dl className="space-y-1.5 border-t border-umber-50 pt-4 text-[13px]">
            <Row label="Subtotal" value={format(order.subtotal ?? 0)} />
            <Row label="Shipping" value={format(order.shipping ?? 0)} />
            <Row label="Tax" value={format(order.tax ?? 0)} />
            <Row label="Total" value={format(order.total ?? 0)} strong />
          </dl>

          <div className="border-t border-umber-50 pt-4">
            <p className="eyebrow mb-3">Invoice and credit notes</p>
            {order.invoiceNumber ? (
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="secondary" icon={FileText} href={`/invoice/${order.id}`} target="_blank" rel="noreferrer">
                  Invoice {order.invoiceNumber}
                </Button>
                {(order.creditNotes ?? []).map((cn) => (
                  <Button key={cn.number} size="sm" variant="secondary" icon={FileText} href={`/invoice/${order.id}?credit=${cn.number}`} target="_blank" rel="noreferrer">
                    Credit note {cn.number} · {format(cn.amount)}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-espresso-soft">
                Payment pending. The payment provider confirms payment automatically; the invoice is issued then.
              </p>
            )}
          </div>

          <div className="border-t border-umber-50 pt-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="eyebrow">Emails to the customer</p>
              {canEdit && order.invoiceNumber && (
                <Button size="sm" variant="ghost" icon={Send} onClick={() => onSendReceipt?.(order)}>
                  Resend confirmation
                </Button>
              )}
            </div>
            {emailsForOrder(order.id).length ? (
              <ul className="space-y-1.5 text-[12px] text-espresso-soft">
                {emailsForOrder(order.id).map((e) => (
                  <li key={e.id} className="flex items-start gap-2">
                    <Mail className="mt-0.5 size-3.5 shrink-0 text-espresso/40" aria-hidden="true" />
                    <span>
                      <span className="text-espresso">{EMAIL_TYPES[e.type]?.label ?? e.type}</span> · {dateFmt.format(new Date(e.createdAt))} · to {e.to} ·{" "}
                      <span className="text-gold-800">queued until email is connected</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12px] text-espresso-soft">None yet.</p>
            )}
          </div>

          {showPayments && <OrdersPayments orderId={order.id} />}

          {transitions.length > 0 && canEdit ? (
            <div className="border-t border-umber-50 pt-4">
              <p className="eyebrow mb-3">Move this order on</p>
              <div className="flex flex-wrap gap-2">
                {transitions.map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={status === "cancelled" || status === "refunded" ? "ghost" : "primary"}
                    onClick={() => (status === "cancelled" ? onCancel?.(order) : status === "refunded" ? onRefund?.(order) : onAdvance(order, status))}
                  >
                    {status === "cancelled"
                      ? order.invoiceNumber ? "Cancel and refund" : "Cancel order"
                      : status === "refunded"
                        ? "Refund…"
                        : `Mark ${status === "to-review" ? "delivered" : (ORDER_STATUS[status]?.label ?? status).toLowerCase()}`}
                  </Button>
                ))}
              </div>
              {/* Forward only: marking shipped notifies the customer and
                  refunding moves money, so reversing is a correction rather
                  than a normal step and is not one click away. */}
              <p className="mt-3 text-[11px] text-espresso-soft">
                {order.status === "to-pay"
                  ? "Payment is confirmed by the payment provider, never by hand. An unpaid order can only be cancelled."
                  : "These steps only move forward. Every change emails the customer."}
              </p>
            </div>
          ) : (
            <p className="border-t border-umber-50 pt-4 text-[12px] text-espresso-soft">
              This order has reached the end of its lifecycle.
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}

function Row({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={strong ? "font-medium text-espresso" : "text-espresso-soft"}>{label}</dt>
      <dd className={`tabular-nums ${strong ? "font-medium text-espresso" : "text-espresso-soft"}`}>
        {value}
      </dd>
    </div>
  );
}
