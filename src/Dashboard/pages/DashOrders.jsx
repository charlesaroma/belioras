import { useCallback, useMemo, useState } from "react";
import { Receipt } from "lucide-react";

import Button from "../../components/ui/Button";
import StatusChip from "../../components/ui/StatusChip";
import Modal from "../../components/common/Modal";
import { useCurrency } from "../../context/CurrencyContext";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../../context/ToastContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { getAllOrders, updateOrderStatus } from "../../services/ordersApi";
import { ORDER_STATUS, nextStatuses, normalizeStatus } from "../../utils/orderStatus";
import DashTable from "../components/DashTable";
import DashToolbar, { FilterTabs, Pagination } from "../components/DashToolbar";
import useDashList from "../hooks/useDashList";

/**
 * Order management.
 *
 * Previously a hardcoded array with 2024 dates and dollar totals in a Lisbon
 * euro store, whose row click was `console.log("View order:", row.id)`. There
 * was no detail view and no way to advance an order — the one thing an admin
 * actually needs to do here.
 */
export default function DashOrders() {
  const { format } = useCurrency();
  const { locale } = useLanguage();
  const { toast } = useToast();

  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((n) => n + 1), []);
  const { data: orders, loading } = useAsyncData(getAllOrders, [revision]);
  const [viewing, setViewing] = useState(null);

  const rows = useMemo(
    () =>
      (orders ?? []).map((o) => ({
        ...o,
        // Normalised up front so filtering and sorting agree with the chips.
        status: normalizeStatus(o.status) ?? o.status,
        customer: o.name ?? o.email ?? "Guest",
      })),
    [orders],
  );

  const list = useDashList(rows, {
    searchKeys: ["id", "customer", "email"],
    filterKey: "status",
    initialSort: { key: "createdAt", direction: "desc" },
  });

  const counts = useMemo(() => {
    const by = (s) => rows.filter((o) => o.status === s).length;
    return { all: rows.length, toPay: by("to-pay"), toShip: by("to-ship"), shipped: by("shipped") };
  }, [rows]);

  const advance = async (order, status) => {
    try {
      const updated = await updateOrderStatus(order.id, status);
      refresh();
      setViewing((v) => (v && v.id === order.id ? { ...v, status: updated.status } : v));
      toast(`${order.id} marked ${ORDER_STATUS[status]?.label ?? status}.`, "success");
    } catch (err) {
      toast(err.message ?? "Could not update that order.", "error");
    }
  };

  const dateFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }),
    [locale],
  );

  const columns = useMemo(
    () => [
      {
        key: "id",
        label: "Order",
        sortable: true,
        render: (row) => <span className="font-medium tabular-nums">{row.id}</span>,
      },
      { key: "customer", label: "Customer", sortable: true },
      {
        key: "items",
        label: "Items",
        align: "right",
        render: (row) => (
          <span className="tabular-nums">
            {(row.items ?? []).reduce((n, i) => n + (i.quantity ?? 1), 0)}
          </span>
        ),
      },
      {
        key: "total",
        label: "Total",
        sortable: true,
        align: "right",
        render: (row) => <span className="tabular-nums">{format(row.total)}</span>,
      },
      {
        key: "status",
        label: "Status",
        sortable: true,
        render: (row) => <StatusChip status={row.status} />,
      },
      {
        key: "createdAt",
        label: "Placed",
        sortable: true,
        render: (row) => (
          <span className="whitespace-nowrap text-espresso-soft">
            {dateFmt.format(new Date(row.createdAt))}
          </span>
        ),
      },
    ],
    [format, dateFmt],
  );

  return (
    <div className="space-y-5">
      <DashToolbar
        query={list.query}
        onQueryChange={list.setQuery}
        placeholder="Search by reference, name or email"
        filters={
          <FilterTabs
            ariaLabel="Filter by status"
            value={list.filter}
            onChange={list.setFilter}
            options={[
              { value: "all", label: "All", count: counts.all },
              { value: "to-pay", label: "To pay", count: counts.toPay },
              { value: "to-ship", label: "To ship", count: counts.toShip },
              { value: "shipped", label: "Shipped", count: counts.shipped },
            ]}
          />
        }
      />

      <DashTable
        columns={columns}
        data={list.rows}
        loading={loading}
        sort={list.sort}
        onSortChange={list.setSort}
        onRowClick={setViewing}
        empty={{
          icon: Receipt,
          title: list.query || list.filter !== "all" ? "No orders match" : "No orders yet",
          description:
            list.query || list.filter !== "all"
              ? "Try a different reference, or clear the status filter."
              : "Orders placed on the storefront appear here.",
        }}
      />

      <Pagination
        page={list.page}
        pageCount={list.pageCount}
        total={list.total}
        onPageChange={list.setPage}
        unit={list.total === 1 ? "order" : "orders"}
      />

      <OrderDetailModal
        order={viewing}
        onClose={() => setViewing(null)}
        onAdvance={advance}
        format={format}
        dateFmt={dateFmt}
      />
    </div>
  );
}

/** Order detail, replacing the console.log that used to be the row action. */
function OrderDetailModal({ order, onClose, onAdvance, format, dateFmt }) {
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
