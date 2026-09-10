/* Admin Dashboard Page: Orders - OrdersDetailModal */
import Button from "../../../../../components/ui/Button";
import StatusChip from "../../../../../components/ui/StatusChip";
import Modal from "../../../../../components/common/Modal";
import { ORDER_STATUS, nextStatuses } from "../../../../../utils/orderStatus";

/* Order Detail Modal */
export default function OrderDetailModal({ order, onClose, onAdvance, format, dateFmt }) {

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

          {transitions.length > 0 ? (
            <div className="border-t border-umber-50 pt-4">
              <p className="eyebrow mb-3">Move this order on</p>
              <div className="flex flex-wrap gap-2">
                {transitions.map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={status === "cancelled" || status === "refunded" ? "ghost" : "primary"}
                    onClick={() => onAdvance(order, status)}
                  >
                    Mark {ORDER_STATUS[status]?.label ?? status}
                  </Button>
                ))}
              </div>
              {/* Forward only: marking shipped notifies the customer and
                  refunding moves money, so reversing is a correction rather
                  than a normal step and is not one click away. */}
              <p className="mt-3 text-[11px] text-espresso-soft">
                These steps only move forward. To correct a mistake, contact client care.
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
