import { useCallback, useMemo, useState } from "react";
import { ShieldCheck, UserCog } from "lucide-react";

import Avatar from "../../components/account/Avatar";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../../context/ToastContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { getUsers, updateUserRole } from "../../services/authApi";
import { CAPABILITIES } from "../../utils/roles";
import { cn } from "../../utils/cn";
import DashTable from "../components/DashTable";
import DashToolbar from "../components/DashToolbar";
import useDashList from "../hooks/useDashList";

const STAFF_ROLES = [
  { value: "staff", label: "Staff" },
  { value: "super-admin", label: "Administrator" },
];

const ROLE_TONE = {
  "super-admin": "bg-gold-500/15 text-gold-800",
  staff: "bg-brown-50 text-brown-700",
};

/**
 * The team.
 *
 * Split from the old combined Users page, which listed shoppers and staff
 * together with a role dropdown on every row — so the control that grants
 * administrator access sat beside a customer's delivery history. Access
 * management is its own job and now has its own page, open to administrators
 * only.
 *
 * Customers are deliberately absent, and the role selector offers only Staff
 * and Administrator. Promoting a shopper is not something to do by scrolling
 * past them: it happens through "Add an existing account", where you name the
 * person you mean.
 *
 * There is no create-account action. An administrator making an account for
 * someone means choosing their password for them.
 */
export default function DashTeam() {
  const { locale } = useLanguage();
  const { toast } = useToast();
  const { user: signedIn } = useAuth();

  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((n) => n + 1), []);
  const { data: users, loading } = useAsyncData(getUsers, [revision]);

  const [pendingRole, setPendingRole] = useState(null);
  const [promoting, setPromoting] = useState(false);
  const [promoteEmail, setPromoteEmail] = useState("");

  const team = useMemo(
    () => (users ?? []).filter((u) => u.role === "super-admin" || u.role === "staff"),
    [users],
  );

  const list = useDashList(team, {
    searchKeys: ["name", "email"],
    initialSort: { key: "role", direction: "asc" },
  });

  const dateFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }),
    [locale],
  );

  const applyRole = async () => {
    const { user, role } = pendingRole;
    setPendingRole(null);
    try {
      await updateUserRole(user.id, role, signedIn);
      refresh();
      toast(
        role === "customer"
          ? `${user.name} no longer has atelier access.`
          : `${user.name} is now ${STAFF_ROLES.find((r) => r.value === role)?.label}.`,
        "success",
      );
    } catch (err) {
      toast(err.message ?? "Could not change that role.", "error");
    }
  };

  const promote = async () => {
    const match = (users ?? []).find(
      (u) => u.email.toLowerCase() === promoteEmail.trim().toLowerCase(),
    );
    if (!match) {
      toast("No account with that email.", "error");
      return;
    }
    if (match.role !== "customer") {
      toast(`${match.name} is already on the team.`, "info");
      return;
    }
    try {
      await updateUserRole(match.id, "staff", signedIn);
      refresh();
      setPromoting(false);
      setPromoteEmail("");
      toast(`${match.name} was added as Staff.`, "success");
    } catch (err) {
      toast(err.message ?? "Could not add that person.", "error");
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "Member",
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
        key: "role",
        label: "Role",
        sortable: true,
        render: (row) => {
          // Changing your own role would revoke access to the page you are
          // standing on, so your row is read-only.
          const isSelf = row.id === signedIn?.id;
          if (isSelf) {
            return (
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
                  ROLE_TONE[row.role],
                )}
                title="You cannot change your own role"
              >
                {STAFF_ROLES.find((r) => r.value === row.role)?.label} · you
              </span>
            );
          }
          return (
            <select
              value={row.role}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setPendingRole({ user: row, role: e.target.value })}
              aria-label={`Role for ${row.name}`}
              className="input py-1.5 text-[12px]"
            >
              {STAFF_ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          );
        },
      },
      {
        key: "access",
        label: "Can manage",
        render: (row) => (
          <span className="text-[12px] text-espresso-soft">
            {[...(CAPABILITIES[row.role] ?? [])].join(", ") || "—"}
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
      {
        key: "actions",
        label: "",
        align: "right",
        render: (row) =>
          row.id === signedIn?.id ? null : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPendingRole({ user: row, role: "customer" });
              }}
              className="text-[11px] uppercase tracking-[0.14em] text-espresso/45 transition-colors hover:text-error"
            >
              Remove access
            </button>
          ),
      },
    ],
    [dateFmt, signedIn?.id],
  );

  return (
    <div className="space-y-5">
      <DashToolbar
        query={list.query}
        onQueryChange={list.setQuery}
        placeholder="Search the team"
      >
        <button type="button" onClick={() => setPromoting(true)} className="btn btn-md btn-primary">
          <UserCog className="size-4" aria-hidden="true" />
          Add an existing account
        </button>
      </DashToolbar>

      <DashTable
        columns={columns}
        data={list.rows}
        loading={loading}
        sort={list.sort}
        onSortChange={list.setSort}
        empty={{ icon: ShieldCheck, title: "No one on the team matches that search" }}
      />

      <p className="text-[11px] leading-relaxed text-espresso-soft">
        Staff run the shop — catalogue, orders and content. Administrators additionally manage the
        team and store settings. Accounts are never created here; a person registers as a customer
        first and is then given access.
      </p>

      <ConfirmDialog
        open={Boolean(pendingRole)}
        onClose={() => setPendingRole(null)}
        onConfirm={applyRole}
        destructive={pendingRole?.role === "customer"}
        title={pendingRole?.role === "customer" ? "Remove atelier access?" : "Change this role?"}
        description={
          pendingRole?.role === "customer"
            ? "They keep their account and order history, but lose the dashboard entirely."
            : "Administrators can see and edit every order, customer and piece, and can change who else has access."
        }
        summary={
          pendingRole && (
            <span>
              <strong className="font-medium">{pendingRole.user.name}</strong>
              {pendingRole.role === "customer"
                ? " becomes a customer again"
                : ` becomes ${STAFF_ROLES.find((r) => r.value === pendingRole.role)?.label}`}
            </span>
          )
        }
        confirmLabel={pendingRole?.role === "customer" ? "Remove access" : "Change role"}
      />

      <ConfirmDialog
        open={promoting}
        onClose={() => {
          setPromoting(false);
          setPromoteEmail("");
        }}
        onConfirm={promote}
        destructive={false}
        title="Add someone to the team"
        description="They must already have a Belioras account. Enter the email they registered with; they join as Staff and can be promoted afterwards."
        summary={
          <input
            type="email"
            value={promoteEmail}
            onChange={(e) => setPromoteEmail(e.target.value)}
            placeholder="name@example.com"
            aria-label="Email of the account to add"
            className="input w-full"
          />
        }
        confirmLabel="Add as staff"
      />
    </div>
  );
}
