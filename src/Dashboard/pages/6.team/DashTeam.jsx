import { useCallback, useMemo, useState } from "react";
import { ShieldCheck, UserCog } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useToast } from "../../../context/ToastContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getUsers, updateUserRole } from "../../../services/authApi";
import DashTable from "../../components/DashTable";
import DashToolbar from "../../components/DashToolbar";
import { roleLabel } from "./sections/constants";
import { buildTeamColumns } from "./sections/teamColumns";
import { AddMemberDialog, RoleChangeDialog } from "./sections/TeamDialogs";

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
 * This file keeps the data and the decisions; the table's columns and the two
 * confirmation dialogs live in sections/.
 */
export default function DashTeam() {
  const { locale } = useLanguage();
  const { toast } = useToast();
  const { user: signedIn } = useAuth();

  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((n) => n + 1), []);
  const { data: users, loading } = useAsyncData(getUsers, [revision]);

  const [query, setQuery] = useState("");
  const [pendingRole, setPendingRole] = useState(null);
  const [promoting, setPromoting] = useState(false);
  const [promoteEmail, setPromoteEmail] = useState("");

  const team = useMemo(
    () => (users ?? []).filter((u) => u.role === "super-admin" || u.role === "staff"),
    [users],
  );

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
          : `${user.name} is now ${roleLabel(role)}.`,
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
    () =>
      buildTeamColumns({
        dateFmt,
        signedInId: signedIn?.id,
        onStageRoleChange: setPendingRole,
      }),
    [dateFmt, signedIn?.id],
  );

  return (
    <div className="space-y-5">
      <DashToolbar query={query} onQueryChange={setQuery} placeholder="Search the team">
        <button type="button" onClick={() => setPromoting(true)} className="btn btn-md btn-primary">
          <UserCog className="size-4" aria-hidden="true" />
          Add an existing account
        </button>
      </DashToolbar>

      <DashTable
        columns={columns}
        data={team}
        loading={loading}
        globalFilter={query}
        initialSorting={[{ id: "role", desc: false }]}
        unit={team.length === 1 ? "member" : "members"}
        empty={{ icon: ShieldCheck, title: "No one on the team matches that search" }}
      />

      <p className="text-[11px] leading-relaxed text-espresso-soft">
        Staff run the shop — catalogue, orders and content. Administrators additionally manage the
        team and store settings. Accounts are never created here; a person registers as a customer
        first and is then given access.
      </p>

      <RoleChangeDialog
        pending={pendingRole}
        onClose={() => setPendingRole(null)}
        onConfirm={applyRole}
      />

      <AddMemberDialog
        open={promoting}
        email={promoteEmail}
        onEmailChange={setPromoteEmail}
        onClose={() => {
          setPromoting(false);
          setPromoteEmail("");
        }}
        onConfirm={promote}
      />
    </div>
  );
}
