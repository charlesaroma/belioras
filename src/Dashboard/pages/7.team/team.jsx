/* Admin Dashboard Page: Team - team */
import { useCallback, useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { useStaffAuth } from "@/context/auth/useAuthRealm";
import { useLanguage } from "../../../context/LanguageContext";
import { useToast } from "../../../context/ToastContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getUsers, updateUserRole } from "../../../services/authApi";
import DashTable from "../../components/DashTable";
import { roleLabel } from "./sections/teamTable/teamTableRoles";
import { buildTeamColumns } from "./sections/teamTable/teamTableColumns";
import { AddMemberDialog, RoleChangeDialog } from "./sections/teamTable/TeamTableDialogs";
import TeamToolbar from "./sections/teamTable/TeamTableToolbar";

export default function DashTeam() {
  const { locale } = useLanguage();
  const { toast } = useToast();
  const { user: signedIn } = useStaffAuth();

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
      <TeamToolbar
        query={query}
        onQueryChange={setQuery}
        onAddExisting={() => setPromoting(true)}
      />

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
