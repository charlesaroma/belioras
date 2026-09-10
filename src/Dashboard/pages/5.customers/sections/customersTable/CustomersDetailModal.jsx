import Avatar from "../../../../../components/account/Avatar";
import Modal from "../../../../../components/common/Modal";
import StatusChip from "../../../../../components/ui/StatusChip";

/** One customer and what they have bought — the reason to open this page. */
export default function CustomerModal({ customer, onClose, format, dateFmt }) {
  return (
    <Modal
      open={Boolean(customer)}
      onClose={onClose}
      title={customer?.name ?? "Customer"}
      width="max-w-xl"
    >
      {customer && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 border-b border-umber-50 pb-4">
            <Avatar user={customer} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] text-espresso">{customer.email}</p>
              <p className="text-[12px] text-espresso-soft">
                Joined {customer.createdAt ? dateFmt.format(new Date(customer.createdAt)) : "—"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.18em] text-espresso-soft">
                Lifetime value
              </p>
              <p className="mt-1 font-display text-2xl tabular-nums text-espresso">
                {format(customer.spent)}
              </p>
            </div>
          </div>

          {customer.orders.length === 0 ? (
            <p className="text-[13px] text-espresso-soft">This customer has not ordered yet.</p>
          ) : (
            <ul className="space-y-2">
              {customer.orders.map((order) => (
                <li
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-3 border border-umber-50 px-4 py-3 text-[13px]"
                >
                  <span className="font-medium tabular-nums text-espresso">{order.id}</span>
                  <span className="text-espresso-soft">
                    {dateFmt.format(new Date(order.createdAt))}
                  </span>
                  <StatusChip status={order.status} />
                  <span className="tabular-nums text-espresso">{format(order.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Modal>
  );
}
