/* Admin Dashboard Page: Team - teamTableColumns */
import Avatar from "../../../../../components/account/Avatar";
import { CAPABILITIES } from "../../../../../utils/roles";
import { cn } from "../../../../../utils/cn";
import { ROLE_TONE, STAFF_ROLES, roleLabel } from "./teamTableRoles";

export function buildTeamColumns({ dateFmt, signedInId, onStageRoleChange }) {
  return [
    {
      accessorKey: "name",
      header: "Member",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar user={row.original} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-espresso">{row.original.name}</p>
            <p className="truncate text-[11px] text-espresso-soft">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {

        const member = row.original;
        // Changing your own role would revoke access to the page you are
        // standing on, so your row is read-only.
        if (member.id === signedInId) {
          return (
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
                ROLE_TONE[member.role],
              )}
              title="You cannot change your own role"
            >
              {roleLabel(member.role)} · you
            </span>
          );
        }

        return (
          <select
            value={member.role}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onStageRoleChange({ user: member, role: e.target.value })}
            aria-label={`Role for ${member.name}`}
            className="input py-1.5 text-[12px]"
          >
            {STAFF_ROLES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      id: "access",
      header: "Can manage",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-[12px] text-espresso-soft">
          {[...(CAPABILITIES[row.original.role] ?? [])].join(", ") || "—"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-espresso-soft">
          {row.original.createdAt ? dateFmt.format(new Date(row.original.createdAt)) : "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      meta: { align: "right" },
      cell: ({ row }) =>
        row.original.id === signedInId ? null : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStageRoleChange({ user: row.original, role: "customer" });
            }}
            className="text-[11px] uppercase tracking-[0.14em] text-espresso/45 transition-colors hover:text-error"
          >
            Remove access
          </button>
        ),
    },
  ];
}
