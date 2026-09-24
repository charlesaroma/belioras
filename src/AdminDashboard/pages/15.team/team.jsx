/* Admin Dashboard Page: Team - team */
import { useCallback, useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { useStaffAuth } from "@/context/auth/useAuthRealm";
import { useLanguage } from "../../../context/LanguageContext";
import { useToast } from "../../../context/ToastContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { addTeamMember, getUsers, updateUserRole } from "../../../services/auth/authApi";
import DashTable from "../../components/DashTable";
import { usePageSize } from "../../lib/usePageSize";
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
  const [addOpen, setAddOpen] = useState({ open: false, n: 0 });

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

  const add = async (form) => {
    const result = await addTeamMember(form, signedIn);
    refresh();
    toast(
      result.created ? `${result.user.name} was added as ${roleLabel(result.user.role)}.` : `${result.user.name} now has ${roleLabel(result.user.role)} access.`,
      "success",
    );
    return result;
  };

  const [pageSize, setPageSize] = usePageSize("team");

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
        onAdd={() => setAddOpen((d) => ({ open: true, n: d.n + 1 }))}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      <DashTable
        columns={columns}
        data={team}
        loading={loading}
        globalFilter={query}
        initialSorting={[{ id: "role", desc: false }]}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        unit={team.length === 1 ? "member" : "members"}
        empty={{ icon: ShieldCheck, title: "No one on the team matches that search" }}
      />

      <p className="text-[11px] leading-relaxed text-espresso-soft">
        Staff run the shop — catalogue, orders, content and marketing. Administrators additionally
        manage the team, payments and store settings. Add someone here with a temporary password,
        or give an existing customer account access by entering its email.
      </p>

      <RoleChangeDialog
        pending={pendingRole}
        onClose={() => setPendingRole(null)}
        onConfirm={applyRole}
      />

      <AddMemberDialog
        key={addOpen.n}
        open={addOpen.open}
        onClose={() => setAddOpen((d) => ({ ...d, open: false }))}
        onAdd={add}
      />
    </div>
  );
}
