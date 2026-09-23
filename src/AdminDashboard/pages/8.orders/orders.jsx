/* Admin Dashboard Page: Orders - orders */
import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Receipt } from "lucide-react";

import { useStaffAuth } from "@/context/auth/useAuthRealm";
import { useCurrency } from "../../../context/CurrencyContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useToast } from "../../../context/ToastContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getAllOrders, returnableUnits, updateOrderStatus } from "../../../services/sales/ordersApi";
import { ORDER_STATUS, normalizeStatus } from "../../../utils/orderStatus";
import DashTable from "../../components/DashTable";
import { usePageSize } from "../../lib/usePageSize";
import { buildOrderColumns } from "./sections/ordersTable/ordersTableColumns";
import OrderDetailModal from "./sections/ordersTable/OrdersDetailModal";
import OrdersToolbar from "./sections/ordersTable/OrdersTableToolbar";
import OrdersRestockDialog from "./sections/ordersTable/OrdersRestockDialog";
import OrdersShipDialog from "./sections/ordersTable/OrdersShipDialog";

const TABS = [["all", "All"], ["to-pay", "To pay"], ["to-ship", "To ship"], ["shipped", "Shipped"]];

export default function DashOrders() {
  const { format } = useCurrency();
  const { locale } = useLanguage();
  const { toast } = useToast();
  const { can, user } = useStaffAuth();

  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((n) => n + 1), []);
  const { data: orders, loading } = useAsyncData(getAllOrders, [revision]);
  const [params, setParams] = useSearchParams();

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
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageSize, setPageSize] = usePageSize("orders");

  const visible = useMemo(
    () => (statusFilter === "all" ? rows : rows.filter((o) => o.status === statusFilter)),
    [rows, statusFilter],
  );

  // The page owns the tabs because they count the whole set, not the filtered one.
  const tabs = useMemo(
    () => TABS.map(([value, label]) => ({ value, label, count: value === "all" ? rows.length : rows.filter((o) => o.status === value).length })),
    [rows],
  );

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
  const advance = (order, status) => {
    const units = returnableUnits(order);
    if ((status === "cancelled" || status === "refunded") && units > 0) setRestockAsk({ order, status, units });
    else if (status === "shipped") setShipAsk({ order });
    else move(order, status);
  };

  const dateFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }),
    [locale],
  );

  const columns = useMemo(() => buildOrderColumns({ format, dateFmt }), [format, dateFmt]);

  return (
    <div className="space-y-5 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
      <OrdersToolbar
        query={query}
        onQueryChange={setQuery}
        tabs={tabs}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      <DashTable
        columns={columns}
        data={visible}
        loading={loading}
        globalFilter={query}
        initialSorting={[{ id: "createdAt", desc: true }]}
        onRowClick={setViewing}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        fill
        unit={visible.length === 1 ? "order" : "orders"}
        empty={{
          icon: Receipt,
          title: query || statusFilter !== "all" ? "No orders match" : "No orders yet",
          description:
            query || statusFilter !== "all"
              ? "Try a different reference, or clear the status filter."
              : "Orders placed on the storefront appear here.",
        }}
      />

      <OrderDetailModal
        order={viewing}
        onClose={() => setViewing(null)}
        onAdvance={advance}
        showPayments={can("payments")}
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
