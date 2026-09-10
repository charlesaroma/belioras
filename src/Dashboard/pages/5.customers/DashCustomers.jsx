import { useMemo, useState } from "react";
import { Users } from "lucide-react";

import Avatar from "../../../components/account/Avatar";
import Modal from "../../../components/common/Modal";
import StatusChip from "../../../components/ui/StatusChip";
import { useCurrency } from "../../../context/CurrencyContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getUsers } from "../../../services/authApi";
import { getAllOrders } from "../../../services/ordersApi";
import DashTable from "../../components/DashTable";
import DashToolbar, { FilterTabs } from "../../components/DashToolbar";

/**
 * Customers.
 *
 * Split from the old combined Users page, which listed shoppers and staff in
 * one table with a role dropdown on every row. Two different jobs sharing a
 * grid: looking up who placed an order, and deciding who can administer the
 * store. Sitting a "make this person an administrator" control beside a
 * customer's delivery history invites exactly the mistake it looks like.
 *
 * There is no role control here at all. A customer's role is not something
 * this page edits — promoting someone is a deliberate act performed on the
 * Team page, which only administrators can open.
 *
 * Staff can see this page. They handle orders, and an order without the person
 * behind it is half a record; the combined page was administrator-only, which
 * locked staff out of the customers they were being asked to serve.
 */
export default function DashCustomers() {
  const { format } = useCurrency();
  const { locale } = useLanguage();

  const { data: users, loading } = useAsyncData(getUsers, []);
  const { data: orders } = useAsyncData(getAllOrders, []);
  const [viewing, setViewing] = useState(null);

  const dateFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }),
    [locale],
  );

  const rows = useMemo(() => {
    const byUser = new Map();
    for (const order of orders ?? []) {
      if (!order.userId) continue;
      const entry = byUser.get(order.userId) ?? { count: 0, spent: 0, last: null, orders: [] };
      entry.count += 1;
      entry.spent += order.total ?? 0;
      entry.orders.push(order);
      const placed = new Date(order.createdAt);
      if (!entry.last || placed > entry.last) entry.last = placed;
      byUser.set(order.userId, entry);
    }

    return (users ?? [])
      .filter((u) => u.role === "customer")
      .map((u) => {
        const stats = byUser.get(u.id);
        return {
          ...u,
          orderCount: stats?.count ?? 0,
          spent: stats?.spent ?? 0,
          lastOrder: stats?.last ?? null,
          orders: (stats?.orders ?? []).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          ),
          // Derived so the filter has one field to work on.
          activity: (stats?.count ?? 0) > 0 ? "ordered" : "none",
        };
      });
  }, [users, orders]);

  const [query, setQuery] = useState("");
  const [activity, setActivity] = useState("all");

  const visible = useMemo(
    () => (activity === "all" ? rows : rows.filter((r) => r.activity === activity)),
    [rows, activity],
  );

  const counts = useMemo(
    () => ({
      all: rows.length,
      ordered: rows.filter((r) => r.activity === "ordered").length,
      none: rows.filter((r) => r.activity === "none").length,
    }),
    [rows],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Customer",
        cell: ({ row: r }) => (
          <div className="flex items-center gap-3">
            <Avatar user={r.original} size="sm" />
            <div className="min-w-0">
              <p className="truncate font-medium text-espresso">{r.original.name}</p>
              <p className="truncate text-[11px] text-espresso-soft">{r.original.email}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "orderCount",
        header: "Orders",
        meta: { align: "right" },
        cell: ({ row: r }) => <span className="tabular-nums">{r.original.orderCount}</span>,
      },
      {
        accessorKey: "spent",
        header: "Lifetime value",
        meta: { align: "right" },
        cell: ({ row: r }) => (
          <span className="tabular-nums">{r.original.spent ? format(r.original.spent) : "—"}</span>
        ),
      },
      {
        accessorKey: "lastOrder",
        header: "Last order",
        cell: ({ row: r }) => (
          <span className="whitespace-nowrap text-espresso-soft">
            {r.original.lastOrder ? dateFmt.format(r.original.lastOrder) : "—"}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ row: r }) => (
          <span className="whitespace-nowrap text-espresso-soft">
            {r.original.createdAt ? dateFmt.format(new Date(r.original.createdAt)) : "—"}
          </span>
        ),
      },
    ],
    [format, dateFmt],
  );

  return (
    <div className="space-y-5">
      <DashToolbar
        query={query}
        onQueryChange={setQuery}
        placeholder="Search customers by name or email"
        filters={
          <FilterTabs
            ariaLabel="Filter by activity"
            value={activity}
            onChange={setActivity}
            options={[
              { value: "all", label: "All", count: counts.all },
              { value: "ordered", label: "Has ordered", count: counts.ordered },
              { value: "none", label: "No orders", count: counts.none },
            ]}
          />
        }
      />

      <DashTable
        columns={columns}
        data={visible}
        loading={loading}
        globalFilter={query}
        initialSorting={[{ id: "spent", desc: true }]}
        onRowClick={setViewing}
        unit={visible.length === 1 ? "customer" : "customers"}
        empty={{
          icon: Users,
          title: query ? "No customers match" : "No customers yet",
          description: query
            ? "Try a different name or email."
            : "Shoppers who register appear here.",
        }}
      />

      <CustomerModal
        customer={viewing}
        onClose={() => setViewing(null)}
        format={format}
        dateFmt={dateFmt}
      />
    </div>
  );
}

/** One customer and what they have bought — the reason to open this page. */
function CustomerModal({ customer, onClose, format, dateFmt }) {
  return (
    <Modal open={Boolean(customer)} onClose={onClose} title={customer?.name ?? "Customer"} width="max-w-xl">
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
            <p className="text-[13px] text-espresso-soft">
              This customer has not ordered yet.
            </p>
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
