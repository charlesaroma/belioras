/* Admin Dashboard Page: Newsletter - subscribersColumns */
import { Trash2, UserMinus } from "lucide-react";

import StatusChip from "@/components/ui/StatusChip";
import IconAction from "@/AdminDashboard/components/IconAction";
import { SIGNUP_SOURCES } from "@/utils/newsletterStatus";

export function buildSubscriberColumns({ dateFmt, onUnsubscribe, onErase }) {
  const date = (value) => (
    <span className="whitespace-nowrap text-espresso-soft">{value ? dateFmt.format(new Date(value)) : "—"}</span>
  );

  return [
    {
      id: "subscriber",
      // Email and name together, so search finds a person by either.
      accessorFn: (s) => `${s.email} ${s.name ?? ""}`,
      header: "Subscriber",
      cell: ({ row: r }) => (
        <div className="min-w-0">
          <p className="truncate text-espresso">{r.original.email}</p>
          {r.original.name && (
            <p className="truncate text-[11px] text-espresso-soft">
              {r.original.name}
              {r.original.userId && " · has an account"}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <StatusChip kind="subscriber" status={getValue()} />,
    },
    {
      id: "source",
      accessorFn: (s) => SIGNUP_SOURCES[s.source] ?? s.source,
      header: "Signed up from",
    },
    { accessorKey: "consentedAt", header: "Consent given", cell: ({ getValue }) => date(getValue()) },
    { accessorKey: "confirmedAt", header: "Confirmed", cell: ({ getValue }) => date(getValue()) },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      meta: { align: "right" },
      cell: ({ row: r }) => (
        <div className="flex justify-end gap-1">
          {["subscribed", "pending"].includes(r.original.status) && (
            <IconAction label={`Unsubscribe ${r.original.email}`} icon={UserMinus} onClick={() => onUnsubscribe(r.original)} />
          )}
          <IconAction label={`Erase ${r.original.email}`} icon={Trash2} destructive onClick={() => onErase(r.original)} />
        </div>
      ),
    },
  ];
}
