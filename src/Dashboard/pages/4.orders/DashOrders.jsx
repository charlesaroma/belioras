import { useCallback, useMemo, useState } from "react";
import { Receipt } from "lucide-react";

import { useCurrency } from "../../../context/CurrencyContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useToast } from "../../../context/ToastContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getAllOrders, updateOrderStatus } from "../../../services/ordersApi";
import { ORDER_STATUS, normalizeStatus } from "../../../utils/orderStatus";
import DashTable from "../../components/DashTable";
import DashToolbar, { FilterTabs } from "../../components/DashToolbar";
import { buildOrderColumns } from "./sections/orderColumns";
import OrderDetailModal from "./sections/OrderDetailModal";

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

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // The page owns the status tabs because they need counts from the whole set.
  const visible = useMemo(
    () => (statusFilter === "all" ? rows : rows.filter((o) => o.status === statusFilter)),
    [rows, statusFilter],
  );

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

  const columns = useMemo(() => buildOrderColumns({ format, dateFmt }), [format, dateFmt]);

  return (
    <div className="space-y-5">
      <DashToolbar
        query={query}
        onQueryChange={setQuery}
        placeholder="Search by reference, name or email"
        filters={
          <FilterTabs
            ariaLabel="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
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
