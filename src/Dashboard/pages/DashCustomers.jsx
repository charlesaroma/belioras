import { useMemo, useState } from "react";
import { Users } from "lucide-react";

import Avatar from "../../components/account/Avatar";
import Modal from "../../components/common/Modal";
import StatusChip from "../../components/ui/StatusChip";
import { useCurrency } from "../../context/CurrencyContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { getUsers } from "../../services/authApi";
import { getAllOrders } from "../../services/ordersApi";
import DashTable from "../components/DashTable";
import DashToolbar, { FilterTabs, Pagination } from "../components/DashToolbar";
import useDashList from "../hooks/useDashList";

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

  const list = useDashList(rows, {
    searchKeys: ["name", "email"],
    filterKey: "activity",
    initialSort: { key: "spent", direction: "desc" },
  });

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
        key: "name",
        label: "Customer",
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-3">
            <Avatar user={row} size="sm" />
            <div className="min-w-0">
              <p className="truncate font-medium text-espresso">{row.name}</p>
              <p className="truncate text-[11px] text-espresso-soft">{row.email}</p>
            </div>
          </div>
        ),
      },
      {
        key: "orderCount",
        label: "Orders",
        sortable: true,
        align: "right",
        render: (row) => <span className="tabular-nums">{row.orderCount}</span>,
      },
      {
        key: "spent",
        label: "Lifetime value",
        sortable: true,
        align: "right",
        render: (row) => (
          <span className="tabular-nums">{row.spent ? format(row.spent) : "—"}</span>
        ),
      },
      {
        key: "lastOrder",
        label: "Last order",
        sortable: true,
        render: (row) => (
          <span className="whitespace-nowrap text-espresso-soft">
            {row.lastOrder ? dateFmt.format(row.lastOrder) : "—"}
          </span>
        ),
      },
      {
        key: "createdAt",
        label: "Joined",
        sortable: true,
        render: (row) => (
          <span className="whitespace-nowrap text-espresso-soft">
            {row.createdAt ? dateFmt.format(new Date(row.createdAt)) : "—"}
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
        placeholder="Search customers by name or email"
        filters={
          <FilterTabs
            ariaLabel="Filter by activity"
            value={list.filter}
            onChange={list.setFilter}
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
        data={list.rows}
        loading={loading}
        sort={list.sort}
        onSortChange={list.setSort}
        onRowClick={setViewing}
        empty={{
          icon: Users,
          title: list.query ? "No customers match" : "No customers yet",
          description: list.query
            ? "Try a different name or email."
            : "Shoppers who register appear here.",
        }}
      />

      <Pagination
        page={list.page}
        pageCount={list.pageCount}
        total={list.total}
        onPageChange={list.setPage}
        unit={list.total === 1 ? "customer" : "customers"}
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
