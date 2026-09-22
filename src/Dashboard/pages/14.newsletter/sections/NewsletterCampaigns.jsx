/* Admin Dashboard Page: Newsletter - NewsletterCampaigns */
import { useState } from "react";
import { Plus, Send } from "lucide-react";

import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import { useAsyncData } from "@/hooks/useAsyncData";
import DashListToolbar from "@/Dashboard/components/DashListToolbar";
import DashTable from "@/Dashboard/components/DashTable";
import { usePageSize } from "@/Dashboard/lib/usePageSize";
import { deleteCampaign, getAudienceSize, getCampaigns } from "@/services/marketing/campaignsApi";
import { getNavigation } from "@/services/catalog/navigationApi";
import { buildCampaignColumns } from "./campaignsColumns";
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
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = usePageSize("campaigns");

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

  const columns = buildCampaignColumns({ fmt, reach, onOpen: open, onDelete: setPendingDelete });

  return (
    <section className="space-y-4">
      <p className="max-w-xl text-[13px] leading-relaxed text-espresso-soft">
        One-off emails to everyone who has confirmed, such as a new collection or a private sale.
        Write one, then send it now or schedule it.
      </p>

      <DashListToolbar
        actions={
          <Button icon={Plus} size="sm" onClick={() => open(null)} className="h-10">
            <span className="hidden sm:inline">New campaign</span>
            <span className="sm:hidden">New</span>
          </Button>
        }
        query={query}
        onQueryChange={setQuery}
        placeholder="Search campaigns"
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      <DashTable
        columns={columns}
        data={campaigns ?? []}
        loading={loading}
        globalFilter={query}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
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
