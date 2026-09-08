import { useCallback, useMemo, useState } from "react";
import { Users } from "lucide-react";

import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useAuth } from "../../context/AuthContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../../context/ToastContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { getUsers, updateUserRole } from "../../services/authApi";
import { getAllOrders } from "../../services/ordersApi";
import { cn } from "../../utils/cn";
import DashTable from "../components/DashTable";
import DashToolbar, { FilterTabs, Pagination } from "../components/DashToolbar";
import useDashList from "../hooks/useDashList";

const ROLES = [
  { value: "customer", label: "Customer" },
  { value: "staff", label: "Staff" },
  { value: "super-admin", label: "Administrator" },
];

const ROLE_TONE = {
  "super-admin": "bg-gold-500/15 text-gold-800",
  staff: "bg-brown-50 text-brown-700",
  customer: "bg-umber-50 text-espresso-soft",
};

/**
 * Accounts.
 *
 * Was a hardcoded five-row array; its "Add User" button had no handler and its
 * row action was a MoreVertical icon opening nothing. It reads the real
 * accounts now, and joins each to its order history — which is the thing an
 * admin actually opens this page to see.
 *
 * There is deliberately no "add user" here: an administrator creating accounts
 * on someone's behalf means setting a password for them. Customers register
 * themselves; staff are promoted from an existing account.
 */
export default function DashUsers() {
  const { format } = useCurrency();
  const { locale } = useLanguage();
  const { toast } = useToast();
  const { user: signedIn, can } = useAuth();
  const canManageTeam = can("team");

  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((n) => n + 1), []);
  const { data: users, loading } = useAsyncData(getUsers, [revision]);
  const { data: orders } = useAsyncData(getAllOrders, [revision]);
  const [pendingRole, setPendingRole] = useState(null);

  const rows = useMemo(() => {
    const byUser = new Map();
    for (const order of orders ?? []) {
      if (!order.userId) continue;
      const entry = byUser.get(order.userId) ?? { count: 0, spent: 0 };
      entry.count += 1;
      entry.spent += order.total ?? 0;
      byUser.set(order.userId, entry);
    }

    return (users ?? []).map((u) => ({
      ...u,
      orderCount: byUser.get(u.id)?.count ?? 0,
      spent: byUser.get(u.id)?.spent ?? 0,
    }));
  }, [users, orders]);

  const list = useDashList(rows, {
    searchKeys: ["name", "email"],
    filterKey: "role",
    initialSort: { key: "name", direction: "asc" },
  });

  const counts = useMemo(
    () => ({
      all: rows.length,
      customer: rows.filter((u) => u.role === "customer").length,
      staff: rows.filter((u) => u.role === "staff").length,
      admin: rows.filter((u) => u.role === "super-admin").length,
    }),
    [rows],
  );

  const applyRole = async () => {
    const { user, role } = pendingRole;
    setPendingRole(null);
    try {
      await updateUserRole(user.id, role, signedIn);
      refresh();
      toast(`${user.name} is now ${ROLES.find((r) => r.value === role)?.label}.`, "success");
    } catch (err) {
      toast(err.message ?? "Could not change that role.", "error");
    }
  };

  const dateFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }),
    [locale],
  );

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "Account",
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gold-500 text-[12px] font-semibold text-espresso">
              {(row.name ?? row.email ?? "?").slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium text-espresso">{row.name}</p>
              <p className="truncate text-[11px] text-espresso-soft">{row.email}</p>
            </div>
          </div>
        ),
      },
      {
        key: "role",
        label: "Role",
        sortable: true,
        render: (row) => {
          // Changing your own role out from under yourself would revoke access
          // to the page you are standing on.
          // Read-only for anyone without `team`, and for your own row: changing
          // your own role would revoke access to the page you are standing on.
          const isSelf = row.id === signedIn?.id;
          return isSelf || !canManageTeam ? (
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
                ROLE_TONE[row.role],
              )}
              title={isSelf ? "You cannot change your own role" : "Only an administrator can change roles"}
            >
              {ROLES.find((r) => r.value === row.role)?.label ?? row.role}
              {isSelf && " · you"}
            </span>
          ) : (
            <select
              value={row.role}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setPendingRole({ user: row, role: e.target.value })}
              aria-label={`Role for ${row.name}`}
              className="input py-1.5 text-[12px]"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          );
        },
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
        label: "Spent",
        sortable: true,
        align: "right",
        render: (row) => (
          <span className="tabular-nums">{row.spent ? format(row.spent) : "—"}</span>
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
    [format, dateFmt, signedIn?.id, canManageTeam],
  );

  return (
    <div className="space-y-5">
      <DashToolbar
        query={list.query}
        onQueryChange={list.setQuery}
        placeholder="Search by name or email"
        filters={
          <FilterTabs
            ariaLabel="Filter by role"
            value={list.filter}
            onChange={list.setFilter}
            options={[
              { value: "all", label: "All", count: counts.all },
              { value: "customer", label: "Customers", count: counts.customer },
              { value: "staff", label: "Staff", count: counts.staff },
              { value: "super-admin", label: "Admins", count: counts.admin },
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
        empty={{
          icon: Users,
          title: "No accounts match",
          description: "Try a different name or email, or clear the role filter.",
        }}
      />

      <Pagination
        page={list.page}
        pageCount={list.pageCount}
        total={list.total}
        onPageChange={list.setPage}
        unit={list.total === 1 ? "account" : "accounts"}
      />

      <ConfirmDialog
        open={Boolean(pendingRole)}
        onClose={() => setPendingRole(null)}
        onConfirm={applyRole}
        destructive={false}
        title="Change this role?"
        description="Staff and administrators can see every order, every customer and the whole catalogue, and can edit all of it."
        summary={
          pendingRole && (
            <span>
              <strong className="font-medium">{pendingRole.user.name}</strong> becomes{" "}
              {ROLES.find((r) => r.value === pendingRole.role)?.label}
            </span>
          )
        }
        confirmLabel="Change role"
      />
    </div>
  );
}
