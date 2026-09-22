/* Admin Dashboard Page: Newsletter - NewsletterCampaigns */
import { useState } from "react";
import { Eye, Pencil, Plus, Send, Trash2 } from "lucide-react";

import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import StatusChip from "@/components/ui/StatusChip";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import { useAsyncData } from "@/hooks/useAsyncData";
import DashTable from "@/Dashboard/components/DashTable";
import IconAction from "@/Dashboard/components/IconAction";
import { deleteCampaign, getAudienceSize, getCampaigns } from "@/services/marketing/campaignsApi";
import { getNavigation } from "@/services/catalog/navigationApi";
import { getProducts } from "@/services/catalog/productsApi";
import CampaignEditor from "./CampaignEditor";
import { pagesFrom } from "./campaignFields";

export default function NewsletterCampaigns() {
  const { toast } = useToast();
  const { locale } = useLanguage();
  const [revision, setRevision] = useState(0);
  const { data: campaigns, loading } = useAsyncData(getCampaigns, [revision]);
  const { data: audience } = useAsyncData(getAudienceSize, [revision]);
  const { data: products } = useAsyncData(getProducts, []);
  const { data: navigation } = useAsyncData(getNavigation, []);

  const [editor, setEditor] = useState({ open: false, campaign: null, n: 0 });
  const [pendingDelete, setPendingDelete] = useState(null);

  const open = (campaign) => setEditor((e) => ({ open: true, campaign, n: e.n + 1 }));
  const close = () => setEditor((e) => ({ ...e, open: false }));
  const fmt = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" });
  const reach = audience ?? 0;

  const remove = async () => {
    const campaign = pendingDelete;
    setPendingDelete(null);
    try {
      await deleteCampaign(campaign.id);
      setRevision((n) => n + 1);
      toast(`“${campaign.subject}” deleted.`, "success");
    } catch (err) {
      toast(err.message ?? "Could not delete that campaign.", "error");
    }
  };

  const columns = [
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
          <IconAction label={`${c.status === "sent" ? "View" : "Edit"} ${c.subject}`} icon={c.status === "sent" ? Eye : Pencil} onClick={() => open(c)} />
          {c.status !== "sent" && <IconAction label={`Delete ${c.subject}`} icon={Trash2} destructive onClick={() => setPendingDelete(c)} />}
        </div>
      ),
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-xl text-[13px] leading-relaxed text-espresso-soft">
          One-off emails to everyone who has confirmed, such as a new collection or a private sale.
          Write one, then send it now or schedule it.
        </p>
        <Button icon={Plus} onClick={() => open(null)} className="bg-espresso text-ivory-50 hover:bg-espresso-600">
          New campaign
        </Button>
      </div>

      <DashTable
        columns={columns}
        data={campaigns ?? []}
        loading={loading}
        onRowClick={open}
        unit={(campaigns ?? []).length === 1 ? "campaign" : "campaigns"}
        empty={{ icon: Send, title: "No campaigns yet", description: "Write the first, such as a note about new arrivals." }}
      />

      <CampaignEditor
        key={editor.n}
        open={editor.open}
        campaign={editor.campaign}
        audience={reach}
        products={products ?? []}
        pages={pagesFrom(navigation)}
        onClose={close}
        onChanged={(message) => {
          setRevision((n) => n + 1);
          close();
          toast(message, "success");
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={remove}
        title={`Delete “${pendingDelete?.subject ?? "campaign"}”?`}
        description="It has not been sent, so no subscriber has received it."
        confirmLabel="Delete campaign"
      />
    </section>
  );
}
