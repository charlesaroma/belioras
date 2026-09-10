/* Admin Dashboard Page: Orders - orders */
import { useCallback, useMemo, useState } from "react";
import { Receipt } from "lucide-react";

import { useCurrency } from "../../../context/CurrencyContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useToast } from "../../../context/ToastContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getAllOrders, updateOrderStatus } from "../../../services/ordersApi";
import { ORDER_STATUS, normalizeStatus } from "../../../utils/orderStatus";
import DashTable from "../../components/DashTable";
import { buildOrderColumns } from "./sections/ordersTable/ordersTableColumns";
import OrderDetailModal from "./sections/ordersTable/OrdersDetailModal";
import OrdersToolbar from "./sections/ordersTable/OrdersTableToolbar";

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

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // The page owns the status tabs because they need counts from the whole set.
  const visible = useMemo(
    () => (statusFilter === "all" ? rows : rows.filter((o) => o.status === statusFilter)),
    [rows, statusFilter],
  );

  // The tabs need counts from the whole set, not the filtered one.
  const tabs = useMemo(() => {
    const by = (status) => rows.filter((o) => o.status === status).length;
    return [
      { value: "all", label: "All", count: rows.length },
      { value: "to-pay", label: "To pay", count: by("to-pay") },
      { value: "to-ship", label: "To ship", count: by("to-ship") },
      { value: "shipped", label: "Shipped", count: by("shipped") },
    ];
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

  const columns = useMemo(() => buildOrderColumns({ format, dateFmt }), [format, dateFmt]);

  return (
    <div className="space-y-5">
      <OrdersToolbar
        query={query}
        onQueryChange={setQuery}
        tabs={tabs}
        status={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <DashTable
        columns={columns}
        data={visible}
        loading={loading}
        globalFilter={query}
        initialSorting={[{ id: "createdAt", desc: true }]}
        onRowClick={setViewing}
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
        format={format}
        dateFmt={dateFmt}
      />
    </div>
  );
}
