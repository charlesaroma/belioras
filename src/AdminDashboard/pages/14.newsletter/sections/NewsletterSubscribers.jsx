/* Admin Dashboard Page: Newsletter - NewsletterSubscribers */
import { useState } from "react";
import { Clock, Download, Mail, MailCheck, MailX, TrendingUp } from "lucide-react";

import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import { useAsyncData } from "@/hooks/useAsyncData";
import DashTable from "@/AdminDashboard/components/DashTable";
import DashListToolbar from "@/AdminDashboard/components/DashListToolbar";
import { usePageSize } from "@/AdminDashboard/lib/usePageSize";
import StatCard from "@/AdminDashboard/components/StatCard";
import { eraseSubscriber, getSubscribers, unsubscribeSubscriber } from "@/services/marketing/subscribersApi";
import { buildSubscriberColumns } from "./subscribersColumns";
import { downloadCsv, statusTabs, subscriberStats, subscribersCsv } from "./subscribersRows";

export default function NewsletterSubscribers() {
  const { toast } = useToast();
  const { locale } = useLanguage();
  const [revision, setRevision] = useState(0);
  const { data, loading } = useAsyncData(getSubscribers, [revision]);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [pending, setPending] = useState(null);
  const [pageSize, setPageSize] = usePageSize("subscribers");

  const rows = data ?? [];
  const visible = status === "all" ? rows : rows.filter((r) => r.status === status);
  const stats = subscriberStats(rows);
  const dateFmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" });
  const erasing = pending?.kind === "erase";

  const act = async () => {
    const { kind, subscriber } = pending;
    setPending(null);
    try {
      if (kind === "erase") {
        await eraseSubscriber(subscriber.id);
        toast(`${subscriber.email} and their consent record were erased.`, "success");
      } else {
        await unsubscribeSubscriber(subscriber.id);
        toast(`${subscriber.email} is unsubscribed and won't be emailed again.`, "success");
      }
      setRevision((n) => n + 1);
    } catch (err) {
      toast(err.message ?? "Could not update that subscriber.", "error");
    }
  };

  const exportCsv = () => {
    const confirmed = rows.filter((r) => r.status === "subscribed");
    downloadCsv(subscribersCsv(confirmed), `belioras-subscribers-${new Date().toISOString().slice(0, 10)}.csv`);
    toast(`${confirmed.length} confirmed ${confirmed.length === 1 ? "subscriber" : "subscribers"} exported.`, "success");
  };

  const show = (n) => (loading ? "—" : String(n));

  return (
    <section className="space-y-5">
      <div className="grid gap-px border border-umber-50 bg-umber-50 grid-cols-2 xl:grid-cols-4">
        <StatCard label="Subscribed" value={show(stats.subscribed)} hint="receive campaigns" icon={MailCheck} />
        <StatCard label="Awaiting confirmation" value={show(stats.pending)} hint="haven't clicked the link yet" icon={Clock} />
        <StatCard label="Unsubscribed" value={show(stats.unsubscribed)} hint="never emailed again" icon={MailX} />
        <StatCard label="Joined in 30 days" value={show(stats.recent)} hint="confirmed sign-ups" icon={TrendingUp} />
      </div>

      <DashListToolbar
        actions={
          <Button variant="secondary" size="sm" icon={Download} onClick={exportCsv} disabled={!stats.subscribed} className="h-10">
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">CSV</span>
          </Button>
        }
        tabs={statusTabs(rows)}
        tab={status}
        onTabChange={setStatus}
        tabsLabel="Subscribers by status"
        query={query}
        onQueryChange={setQuery}
        placeholder="Search subscribers"
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      <DashTable
        columns={buildSubscriberColumns({
          dateFmt,
          onUnsubscribe: (subscriber) => setPending({ kind: "unsubscribe", subscriber }),
          onErase: (subscriber) => setPending({ kind: "erase", subscriber }),
        })}
        data={visible}
        loading={loading}
        globalFilter={query}
        initialSorting={[{ id: "consentedAt", desc: true }]}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        unit={visible.length === 1 ? "subscriber" : "subscribers"}
        empty={{
          icon: Mail,
          title: query || status !== "all" ? "No subscribers match" : "No subscribers yet",
          description: "People who join from the footer or their account appear here.",
        }}
      />

      <p className="text-[12px] leading-relaxed text-espresso-soft">
        Subscribers can't be added by hand: everyone on the list gave consent themselves. The export
        holds confirmed subscribers only, with when and where they agreed.
      </p>

      <ConfirmDialog
        open={Boolean(pending)}
        onClose={() => setPending(null)}
        onConfirm={act}
        title={erasing ? `Erase ${pending?.subscriber.email}?` : `Unsubscribe ${pending?.subscriber.email}?`}
        description={
          erasing
            ? "Deletes the address and its consent record entirely, as a GDPR erasure request requires. This cannot be undone."
            : "They stop receiving the Letter straight away, and can join again by signing up."
        }
        confirmLabel={erasing ? "Erase" : "Unsubscribe"}
        destructive={erasing}
      />
    </section>
  );
}
