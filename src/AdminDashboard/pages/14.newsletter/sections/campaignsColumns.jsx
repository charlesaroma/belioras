/* Admin Dashboard Page: Newsletter - campaignsColumns */
import { Eye, Pencil, Trash2 } from "lucide-react";
import StatusChip from "@/components/ui/StatusChip";
import IconAction from "@/AdminDashboard/components/IconAction";

export function buildCampaignColumns({ fmt, reach, onOpen, onDelete }) {
    return [
      {
        accessorKey: "subject",
        header: "Campaign",
        cell: ({ row: r }) => (
          <div className="min-w-0">
            <p className="truncate font-medium text-espresso">{r.original.subject}</p>
            {r.original.previewText && <p className="truncate text-[11px] text-espresso-soft">{r.original.previewText}</p>}
          </div>
        ),
      },
      { accessorKey: "status", header: "Status", cell: ({ getValue }) => <StatusChip kind="campaign" status={getValue()} /> },
      {
        id: "when",
        header: "When",
        enableSorting: false,
        cell: ({ row: { original: c } }) => (
          <span className="whitespace-nowrap text-espresso-soft">
            {c.status === "sent" ? `Sent ${fmt.format(new Date(c.sentAt))}` : c.status === "scheduled" ? `Sends ${fmt.format(new Date(c.sendAt))}` : `Edited ${fmt.format(new Date(c.updatedAt))}`}
          </span>
        ),
      },
      {
        id: "audience",
        header: "Audience",
        enableSorting: false,
        meta: { align: "right" },
        cell: ({ row: { original: c } }) => (
          <span className="whitespace-nowrap tabular-nums">{c.status === "sent" ? `${c.recipients} sent` : `${reach} subscribers`}</span>
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        meta: { align: "right" },
        cell: ({ row: { original: c } }) => (
          <div className="flex justify-end gap-1">
            <IconAction label={`${c.status === "sent" ? "View" : "Edit"} ${c.subject}`} icon={c.status === "sent" ? Eye : Pencil} onClick={() => onOpen(c)} />
            {c.status !== "sent" && <IconAction label={`Delete ${c.subject}`} icon={Trash2} destructive onClick={() => onDelete(c)} />}
          </div>
        ),
      },
    ];
}
