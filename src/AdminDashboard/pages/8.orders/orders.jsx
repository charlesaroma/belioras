/* Admin Dashboard Page: Orders - orders */
import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Download, Printer, Receipt, Truck } from "lucide-react";

import { useStaffAuth } from "@/context/auth/useAuthRealm";
import { useCurrency } from "../../../context/CurrencyContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useToast } from "../../../context/ToastContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getAllOrders, returnableUnits, sendPaymentReminder, sendReceipt, updateOrderStatus } from "../../../services/sales/ordersApi";
import { getTransactions } from "../../../services/sales/transactionsApi";
import { ORDER_STATUS } from "../../../utils/orderStatus";
import Button from "../../../components/ui/Button";
import DashHeaderActions from "../../components/DashHeaderActions";
import DashListToolbar from "../../components/DashListToolbar";
import DashSelect from "../../components/DashSelect";
import { downloadCsv, toCsv } from "../../lib/csv";
import OrdersAttention from "./sections/ordersTable/OrdersAttention";
import { FULFILMENT, PAYMENT, PERIODS, TABS, inPeriod, toRows } from "./sections/ordersTable/ordersRows";
import DashTable from "../../components/DashTable";
import { usePageSize } from "../../lib/usePageSize";
import { buildOrderColumns } from "./sections/ordersTable/ordersTableColumns";
import OrderDetailModal from "./sections/ordersTable/OrdersDetailModal";
import OrdersRestockDialog from "./sections/ordersTable/OrdersRestockDialog";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import OrdersShipDialog from "./sections/ordersTable/OrdersShipDialog";

export default function DashOrders() {
  const { format } = useCurrency();
  const { locale } = useLanguage();
  const { toast } = useToast();
  const { can, canEdit, user } = useStaffAuth();
  const editable = canEdit("orders");

  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((n) => n + 1), []);
  const { data: orders, loading } = useAsyncData(getAllOrders, [revision]);
  const { data: txns } = useAsyncData(getTransactions, [revision]);
  const [params, setParams] = useSearchParams();

  const rows = useMemo(() => toRows(orders ?? [], txns ?? []), [orders, txns]);

  // The open order lives in the URL, so a transaction can link straight to it.
  const viewing = rows.find((o) => o.id === params.get("order")) ?? null;
  const setViewing = (order) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (order) next.set("order", order.id);
        else next.delete("order");
        return next;
      },
      { replace: !order },
    );

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState(() => (TABS.some(([value]) => value === params.get("status")) ? params.get("status") : "all"));
  const [period, setPeriod] = useState("all");
  const [payment, setPayment] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [pageSize, setPageSize] = usePageSize("orders");
  const [selected, setSelected] = useState([]);
  const [tableKey, setTableKey] = useState(0);
  const clearSelection = () => {
    setSelected([]);
    setTableKey((k) => k + 1);
  };

  // Period, payment and customer narrow the whole list; the tabs count within that.
  const scoped = useMemo(
    () =>
      rows.filter(
        (r) => inPeriod(r, period) && (!payment || r.payment === payment) && (!customerType || r.customerType === customerType),
      ),
    [rows, period, payment, customerType],
  );
  const visible = useMemo(() => scoped.filter(TABS.find(([v]) => v === tab)?.[2] ?? (() => true)), [scoped, tab]);
  const tabs = useMemo(
    () => TABS.map(([value, label, test]) => ({ value, label, count: scoped.filter(test).length })),
    [scoped],
  );

  const chosen = rows.filter((r) => selected.includes(r.id));
  const shippable = chosen.filter((r) => r.status === "to-ship");

  const move = async (order, status, { restock = false, trackingRef, carrier } = {}) => {
    try {
      await updateOrderStatus(order.id, status, { restock, by: user?.name, trackingRef, carrier });
      refresh();
      const label = ORDER_STATUS[status]?.label ?? status;
      toast(restock ? `${order.id} marked ${label}. Its pieces are back in stock.` : `${order.id} marked ${label}.`, "success");
    } catch (err) {
      toast(err.message ?? "Could not update that order.", "error");
    }
  };

  // A shipped order that is cancelled or refunded: were its pieces returned?
  const [restockAsk, setRestockAsk] = useState(null);
  // Marking an order shipped: a chance to record its tracking number and carrier.
  const [shipAsk, setShipAsk] = useState(null);
  // Cancelling or refunding an order nothing shipped for: confirm before it happens.
  const [endAsk, setEndAsk] = useState(null);
  const advance = (order, status) => {
    const units = returnableUnits(order);
    if ((status === "cancelled" || status === "refunded") && units > 0) setRestockAsk({ order, status, units });
    else if (status === "cancelled" || status === "refunded") setEndAsk({ order, status });
    else if (status === "shipped") setShipAsk({ order });
    else move(order, status);
  };

  const onNext = async (order) => {
    if (order.next === "ship") return setShipAsk({ order });
    if (order.next === "deliver") return move(order, "to-review");
    if (order.next === "remind") {
      try {
        await sendPaymentReminder(order.id);
        refresh();
        toast(`Payment reminder for ${order.id} queued to ${order.email}. It sends once email is connected.`, "success");
      } catch (err) {
        toast(err.message ?? "Could not queue that reminder.", "error");
      }
    }
  };

  const [bulkShipAsk, setBulkShipAsk] = useState(false);
  const bulkShip = async () => {
    setBulkShipAsk(false);
    const ids = shippable.map((o) => o.id);
    try {
      for (const id of ids) await updateOrderStatus(id, "shipped", { by: user?.name });
      clearSelection();
      refresh();
      toast(`${ids.length} ${ids.length === 1 ? "order" : "orders"} marked shipped.`, "success");
    } catch (err) {
      refresh();
      toast(err.message ?? "Could not mark those orders shipped.", "error");
    }
  };

  const exportCsv = () =>
    downloadCsv(
      toCsv(
        [
          ["id", "Order"], [(r) => r.createdAt.slice(0, 10), "Date"], ["customer", "Customer"], ["email", "Email"],
          [(r) => (r.customerType === "account" ? "Account" : "Guest"), "Customer type"], ["itemCount", "Items"],
          [(r) => PAYMENT[r.payment]?.label, "Payment"], [(r) => FULFILMENT[r.fulfilment]?.label, "Fulfilment"],
          ["invoiceNumber", "Invoice"], ["total", "Total (EUR)"], ["couponCode", "Coupon"], ["shippingAddress", "Delivery address"],
        ],
        visible,
      ),
      "belioras-orders.csv",
    );

  const dateFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }),
    [locale],
  );

  const columns = useMemo(
    () => buildOrderColumns({ format, dateFmt, canEdit: editable, onNext }),
    // onNext closes over refresh, toast and the dialogs' setters only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [format, dateFmt, editable],
  );

  return (
    <div className="space-y-5 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
      <DashHeaderActions>
        <Button icon={Download} size="sm" variant="secondary" onClick={exportCsv} className="h-10" disabled={!visible.length}>
          Export<span className="hidden sm:inline"> CSV</span>
        </Button>
      </DashHeaderActions>

      <OrdersAttention rows={rows} format={format} onReview={(t) => { setTab(t); clearSelection(); }} />

      <DashListToolbar
        tabs={tabs}
        tab={tab}
        onTabChange={(t) => { setTab(t); clearSelection(); }}
        tabsLabel="Orders"
        query={query}
        onQueryChange={setQuery}
        placeholder="Order number, name or email"
        controls={
          <>
            <DashSelect label="Period" value={period} onChange={setPeriod} options={PERIODS.map((p) => ({ value: p.value, label: p.label }))} />
            <DashSelect
              label="Payment"
              value={payment}
              onChange={setPayment}
              options={[{ value: "", label: "Any payment" }, ...Object.entries(PAYMENT).map(([value, m]) => ({ value, label: m.label }))]}
            />
            <DashSelect
              label="Customer type"
              value={customerType}
              onChange={setCustomerType}
              options={[{ value: "", label: "All customers" }, { value: "account", label: "With an account" }, { value: "guest", label: "Guest checkout" }]}
            />
          </>
        }
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        below={
          selected.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 bg-espresso px-4 py-3 text-ivory-50">
              <p className="text-[14px]">{selected.length} selected</p>
              <div className="ml-auto flex flex-wrap gap-2">
                <a
                  href={`/packing-slips?ids=${selected.join(",")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 border border-ivory-50/25 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-ivory-50"
                >
                  <Printer className="size-4" aria-hidden="true" /> Packing slips
                </a>
                {editable && shippable.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setBulkShipAsk(true)}
                    className="inline-flex h-10 items-center gap-2 bg-gold-500 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-espresso transition-colors hover:bg-gold-400"
                  >
                    <Truck className="size-4" aria-hidden="true" /> Mark {shippable.length} shipped
                  </button>
                )}
                <button type="button" onClick={clearSelection} className="h-10 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ivory-50/80 hover:text-ivory-50">
                  Clear
                </button>
              </div>
            </div>
          )
        }
      />

      <DashTable
        key={tableKey}
        columns={columns}
        data={visible}
        loading={loading}
        globalFilter={query}
        initialSorting={[{ id: "createdAt", desc: true }]}
        onRowClick={setViewing}
        enableSelection
        onSelectionChange={setSelected}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        fill
        unit={visible.length === 1 ? "order" : "orders"}
        empty={{
          icon: Receipt,
          title: rows.length ? "No orders match" : "No orders yet",
          description: rows.length ? "Try another search, tab or filter." : "Orders placed on the storefront appear here.",
        }}
      />

      <ConfirmDialog
        open={bulkShipAsk}
        onClose={() => setBulkShipAsk(false)}
        onConfirm={bulkShip}
        destructive={false}
        title={`Mark ${shippable.length} ${shippable.length === 1 ? "order" : "orders"} shipped?`}
        description="Their pieces come off the shelf and customers see them as shipped. Add tracking numbers one by one from each order if you have them."
        summary={shippable.map((o) => o.id).join(" · ")}
        confirmLabel="Mark shipped"
      />

      <OrderDetailModal
        order={viewing}
        onClose={() => setViewing(null)}
        onAdvance={advance}
        showPayments={can("transactions")}
        canEdit={canEdit("orders")}
        onSendReceipt={async (order) => {
          try {
            await sendReceipt(order.id);
            refresh();
            toast(`Receipt for ${order.id} queued to ${order.email}. It sends once email is connected.`, "success");
          } catch (err) {
            toast(err.message ?? "Could not queue that receipt.", "error");
          }
        }}
        format={format}
        dateFmt={dateFmt}
      />

      <OrdersRestockDialog
        ask={restockAsk}
        onClose={() => setRestockAsk(null)}
        onAnswer={(restock) => {
          move(restockAsk.order, restockAsk.status, { restock });
          setRestockAsk(null);
        }}
      />

      <ConfirmDialog
        open={Boolean(endAsk)}
        onClose={() => setEndAsk(null)}
        onConfirm={() => {
          move(endAsk.order, endAsk.status);
          setEndAsk(null);
        }}
        title={endAsk?.status === "refunded" ? "Refund this order?" : "Cancel this order?"}
        description={
          endAsk?.status === "refunded"
            ? "The order is marked refunded. The payment itself is refunded in Transactions."
            : "The order is marked cancelled and any stock it was holding is released. This cannot be undone."
        }
        summary={endAsk && `${endAsk.order.id} · ${endAsk.order.name ?? endAsk.order.email ?? "Guest"}`}
        confirmLabel={endAsk?.status === "refunded" ? "Refund order" : "Cancel order"}
        cancelLabel="Keep order"
      />

      <OrdersShipDialog
        ask={shipAsk}
        onClose={() => setShipAsk(null)}
        onConfirm={({ trackingRef, carrier }) => {
          move(shipAsk.order, "shipped", { trackingRef, carrier });
          setShipAsk(null);
        }}
      />
    </div>
  );
}
