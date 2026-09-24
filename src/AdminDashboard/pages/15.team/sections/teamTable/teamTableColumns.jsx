/* Admin Dashboard Page: Team - teamTableColumns */
import { Copy, RefreshCw, X } from "lucide-react";

import Avatar from "../../../../../components/account/Avatar";
import IconAction from "../../../../components/IconAction";
import { reach } from "../../../../../utils/permissions";

/** "12 sections · 8 can change" — how far a role reaches, at a glance. */
function reachText(role) {
  if (!role) return "—";
  if (role.locked) return "Everything";
  const sections = reach(role);
  const edits = sections.filter((s) => role.permissions?.[s.id] === "edit" && !s.readOnly).length;
  return `${sections.length} ${sections.length === 1 ? "section" : "sections"}${edits ? ` · ${edits} to change` : " · view only"}`;
}

export function buildTeamColumns({ dateFmt, timeFmt, roles, lastSeen, signedInId, canManage, onStageRoleChange, onCopyInvite, onRenewInvite, onCancelInvite }) {
  const roleOf = (id) => roles.find((r) => r.id === id);
  return [
    {
      accessorKey: "name",
      header: "Member",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar user={row.original} size="sm" />
          <div className="min-w-0">
            <p className="flex items-center gap-2 truncate font-medium text-espresso">
              {row.original.name}
              {row.original.status === "invited" && (
                <span className="bg-gold-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-gold-800">Invited</span>
              )}
              {row.original.id === signedInId && <span className="text-[11px] font-normal text-espresso-soft">(you)</span>}
            </p>
            <p className="truncate text-[11px] text-espresso-soft">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      sortingFn: (a, b) => (roleOf(a.original.role)?.name ?? "").localeCompare(roleOf(b.original.role)?.name ?? ""),
      cell: ({ row }) => {
        const member = row.original;
        // Your own row is read-only: changing it would revoke the access you are using.
        if (member.id === signedInId || !canManage) {
          return <span className="text-[13px] text-espresso">{roleOf(member.role)?.name ?? member.role}</span>;
        }
        return (
          <select
            value={member.role}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onStageRoleChange({ user: member, role: e.target.value })}
            aria-label={`Role for ${member.name}`}
            className="input h-9 max-w-52 py-1 text-[12px]"
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        );
      },
    },
    {
      id: "access",
      header: "Access",
      enableSorting: false,
      cell: ({ row }) => <span className="text-[12px] text-espresso-soft">{reachText(roleOf(row.original.role))}</span>,
    },
    {
      id: "lastSeen",
      header: "Last signed in",
      accessorFn: (r) => lastSeen[r.id] ?? "",
      cell: ({ row }) => {
        const m = row.original;
        if (m.status === "invited") return <span className="text-[12px] text-espresso-soft">Invited {m.invitedAt ? dateFmt.format(new Date(m.invitedAt)) : ""}</span>;
        const at = lastSeen[m.id];
        return <span className="whitespace-nowrap text-[12px] text-espresso-soft">{at ? timeFmt.format(new Date(at)) : "Not since logging began"}</span>;
      },
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      meta: { align: "right" },
      cell: ({ row }) => {
        const m = row.original;
        if (!canManage || m.id === signedInId) return null;
        if (m.status === "invited") {
          return (
            <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
              <IconAction label={`Copy ${m.name}'s invitation link`} icon={Copy} onClick={() => onCopyInvite(m)} />
              <IconAction label={`New invitation link for ${m.name}`} icon={RefreshCw} onClick={() => onRenewInvite(m)} />
              <IconAction label={`Withdraw ${m.name}'s invitation`} icon={X} destructive onClick={() => onCancelInvite(m)} />
            </div>
          );
        }
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStageRoleChange({ user: m, role: "customer" });
            }}
            className="whitespace-nowrap text-[11px] uppercase tracking-[0.14em] text-espresso/45 transition-colors hover:text-error"
          >
            Remove access
          </button>
        );
      },
    },
  ];
}
