/* Admin Dashboard Page: Team - team */
import { useCallback, useMemo, useState } from "react";
import { Plus, ShieldCheck, UserPlus } from "lucide-react";

import { useStaffAuth } from "@/context/auth/useAuthRealm";
import Button from "../../../components/ui/Button";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import { useLanguage } from "../../../context/LanguageContext";
import { useToast } from "../../../context/ToastContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import {
  addTeamMember, cancelInvite, createRole, deleteRole, getRoles, getUsers, renewInvite, updateRole, updateUserRole,
} from "../../../services/auth/authApi";
import { lastSignIns } from "../../../services/auth/activityApi";
import DashHeaderActions from "../../components/DashHeaderActions";
import DashListToolbar from "../../components/DashListToolbar";
import DashTable from "../../components/DashTable";
import { usePageSize } from "../../lib/usePageSize";
import RoleEditorDialog from "./sections/roles/RoleEditorDialog";
import RolesPanel from "./sections/roles/RolesPanel";
import { buildTeamColumns } from "./sections/teamTable/teamTableColumns";
import { AddMemberDialog, RoleChangeDialog } from "./sections/teamTable/TeamTableDialogs";
import { inviteUrl } from "./sections/teamTable/inviteUrl";

/**
 * Who works in the dashboard and what each of them can do. Members holds the
 * people; Roles holds what a role opens, section by section. Every change here
 * is written to the activity log.
 */
export default function DashTeam() {
  const { locale } = useLanguage();
  const { toast } = useToast();
  const { user: signedIn, canEdit } = useStaffAuth();
  const canManage = canEdit("team");

  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((n) => n + 1), []);
  const { data: users, loading } = useAsyncData(getUsers, [revision]);
  const { data: roles } = useAsyncData(getRoles, [revision]);
  const { data: lastSeen } = useAsyncData(lastSignIns, [revision]);

  const [tab, setTab] = useState("members");
  const [query, setQuery] = useState("");
  const [pendingRole, setPendingRole] = useState(null);
  const [pendingCancel, setPendingCancel] = useState(null);
  const [pendingDeleteRole, setPendingDeleteRole] = useState(null);
  const [adding, setAdding] = useState({ open: false, n: 0 });
  const [editing, setEditing] = useState({ open: false, role: null, n: 0 });
  const [pageSize, setPageSize] = usePageSize("team");

  const roleList = useMemo(() => roles ?? [], [roles]);
  const team = useMemo(() => (users ?? []).filter((u) => u.role !== "customer"), [users]);

  const dateFmt = useMemo(() => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }), [locale]);
  const timeFmt = useMemo(() => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }), [locale]);

  const run = async (fn, message) => {
    try {
      const result = await fn();
      refresh();
      if (message) toast(typeof message === "function" ? message(result) : message, "success");
      return result;
    } catch (err) {
      toast(err.message ?? "That didn't work.", "error");
      return null;
    }
  };

  const applyRole = async () => {
    const { user, role } = pendingRole;
    setPendingRole(null);
    const name = roleList.find((r) => r.id === role)?.name;
    await run(() => updateUserRole(user.id, role, signedIn), role === "customer" ? `${user.name} no longer has dashboard access.` : `${user.name} is now ${name}.`);
  };

  const copyInvite = async (member, token = member.inviteToken) => {
    try {
      await navigator.clipboard.writeText(inviteUrl(token));
      toast(`Invitation link for ${member.name} copied.`, "success");
    } catch {
      toast("Could not copy the link.", "error");
    }
  };

  const add = async (form) => {
    const result = await addTeamMember(form);
    refresh();
    return result;
  };

  const saveRole = async (form) => {
    const role = editing.role;
    const saved = role ? await updateRole(role.id, form) : await createRole(form);
    refresh();
    setEditing((e) => ({ ...e, open: false }));
    toast(`${saved.name} ${role ? "saved" : "created"}.`, "success");
  };

  const columns = useMemo(
    () =>
      buildTeamColumns({
        dateFmt, timeFmt, roles: roleList, lastSeen: lastSeen ?? {}, signedInId: signedIn?.id, canManage,
        onStageRoleChange: setPendingRole,
        onCopyInvite: (m) => copyInvite(m),
        onRenewInvite: (m) => run(() => renewInvite(m.id), (r) => { copyInvite(m, r.token); return `New link for ${m.name} created and copied.`; }),
        onCancelInvite: setPendingCancel,
      }),
    // copyInvite/run close over toast and refresh only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateFmt, timeFmt, roleList, lastSeen, signedIn?.id, canManage],
  );

  const tabs = [
    { value: "members", label: "Members", count: team.length },
    { value: "roles", label: "Roles", count: roleList.length },
  ];

  return (
    <div className="space-y-5">
      {canManage && (
        <DashHeaderActions>
          {tab === "members" ? (
            <Button icon={UserPlus} size="sm" onClick={() => setAdding((d) => ({ open: true, n: d.n + 1 }))} className="h-10">
              Invite<span className="hidden sm:inline"> member</span>
            </Button>
          ) : (
            <Button icon={Plus} size="sm" onClick={() => setEditing((e) => ({ open: true, role: null, n: e.n + 1 }))} className="h-10">
              New role
            </Button>
          )}
        </DashHeaderActions>
      )}

      {tab === "members" ? (
        <>
          <DashListToolbar
            tabs={tabs}
            tab={tab}
            onTabChange={setTab}
            tabsLabel="Team"
            query={query}
            onQueryChange={setQuery}
            placeholder="Search the team"
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
        </>
      ) : (
        <>
          <DashListToolbar tabs={tabs} tab={tab} onTabChange={setTab} tabsLabel="Team" />
          <p className="max-w-3xl text-[13px] leading-relaxed text-espresso-soft">
            A role decides what someone sees in the dashboard. For each section it gives <strong className="font-medium text-espresso">Edit</strong>,{" "}
            <strong className="font-medium text-espresso">View</strong> (look, change nothing) or <strong className="font-medium text-espresso">No access</strong>{" "}
            (hidden from the sidebar). Changes apply the moment you save, even to people already signed in.
          </p>
          <RolesPanel
            roles={roleList}
            canManage={canManage}
            onEdit={(role) => setEditing((e) => ({ open: true, role, n: e.n + 1 }))}
            onDelete={setPendingDeleteRole}
          />
        </>
      )}

      <RoleChangeDialog pending={pendingRole} roles={roleList} onClose={() => setPendingRole(null)} onConfirm={applyRole} />

      <AddMemberDialog key={adding.n} open={adding.open} roles={roleList} onClose={() => setAdding((d) => ({ ...d, open: false }))} onAdd={add} />

      <RoleEditorDialog
        key={`role-${editing.n}`}
        open={editing.open}
        role={editing.role}
        roles={roleList}
        onClose={() => setEditing((e) => ({ ...e, open: false }))}
        onSave={saveRole}
      />

      <ConfirmDialog
        open={Boolean(pendingCancel)}
        onClose={() => setPendingCancel(null)}
        onConfirm={async () => {
          const m = pendingCancel;
          setPendingCancel(null);
          await run(() => cancelInvite(m.id), `Invitation for ${m.name} withdrawn.`);
        }}
        title="Withdraw this invitation?"
        description="The link stops working and the waiting account is removed. You can invite them again later."
        confirmLabel="Withdraw"
      />

      <ConfirmDialog
        open={Boolean(pendingDeleteRole)}
        onClose={() => setPendingDeleteRole(null)}
        onConfirm={async () => {
          const r = pendingDeleteRole;
          setPendingDeleteRole(null);
          await run(() => deleteRole(r.id), `${r.name} deleted.`);
        }}
        title={`Delete the ${pendingDeleteRole?.name ?? ""} role?`}
        description="Nobody can hold it any more. A role that people still hold can't be deleted until they have another."
        confirmLabel="Delete role"
      />
    </div>
  );
}
