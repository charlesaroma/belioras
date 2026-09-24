/* Admin Dashboard Page: Activity - activity */
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Download, History } from "lucide-react";

import Button from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getActivity } from "@/services/auth/activityApi";
import { roleName } from "@/utils/roles";
import { SECTIONS } from "@/utils/permissions";
import { cn } from "@/utils/cn";
import DashListToolbar from "../../components/DashListToolbar";
import DashSelect from "../../components/DashSelect";
import DashTable from "../../components/DashTable";
import DashTabs from "../../components/DashTabs";
import EmailOutbox from "./sections/EmailOutbox";
import { downloadCsv, toCsv } from "../../lib/csv";
import { usePageSize } from "../../lib/usePageSize";

const AREA = Object.fromEntries([["auth", "Sign-in"], ...SECTIONS.map((s) => [s.id, s.label])]);

/**
 * Everything that happened in the dashboard: sign-ins (and failed attempts at
 * the atelier door), and every change anyone saved, with who, when and what.
 * Written by the services themselves, so a change can't happen without its
 * line here.
 */
function ActivityLog() {
  const { locale } = useLanguage();
  const { data, loading } = useAsyncData(getActivity, []);
  const entries = useMemo(() => data ?? [], [data]);

  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [person, setPerson] = useState("");
  const [area, setArea] = useState("");
  const [pageSize, setPageSize] = usePageSize("activity");

  const timeFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    [locale],
  );

  const who = (e) => e.actorName ?? e.actorEmail ?? "Unknown";
  const people = useMemo(() => [...new Set(entries.map(who))].sort(), [entries]);
  const areas = useMemo(() => [...new Set(entries.map((e) => e.section))], [entries]);

  const by = (test) => entries.filter(test).length;
  const tabs = [
    { value: "all", label: "All", count: entries.length },
    { value: "changes", label: "Changes", count: by((e) => e.section !== "auth") },
    { value: "signins", label: "Sign-ins", count: by((e) => e.section === "auth" && e.outcome !== "failed") },
    { value: "failed", label: "Failed sign-ins", count: by((e) => e.outcome === "failed") },
  ];

  const visible = entries.filter((e) => {
    if (tab === "changes" && e.section === "auth") return false;
    if (tab === "signins" && (e.section !== "auth" || e.outcome === "failed")) return false;
    if (tab === "failed" && e.outcome !== "failed") return false;
    if (person && who(e) !== person) return false;
    if (area && e.section !== area) return false;
    return true;
  });

  const columns = [
    {
      accessorKey: "at",
      header: "When",
      cell: ({ getValue }) => <span className="whitespace-nowrap tabular-nums text-espresso-soft">{timeFmt.format(new Date(getValue()))}</span>,
    },
    {
      id: "who",
      accessorFn: who,
      header: "Who",
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="truncate text-espresso">{who(row.original)}</p>
          <p className="truncate text-[11px] text-espresso-soft">
            {row.original.actorRole ? roleName(row.original.actorRole) : row.original.actorEmail && row.original.actorName ? row.original.actorEmail : "—"}
          </p>
        </div>
      ),
    },
    {
      id: "area",
      accessorFn: (e) => AREA[e.section] ?? e.section,
      header: "Area",
      cell: ({ row, getValue }) => (
        <span
          className={cn(
            "inline-flex whitespace-nowrap px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
            row.original.outcome === "failed" ? "bg-error/10 text-error" : row.original.section === "auth" ? "bg-gold-500/15 text-gold-800" : "bg-umber-50 text-espresso-soft",
          )}
        >
          {getValue()}
        </span>
      ),
    },
    { accessorKey: "summary", header: "What happened", cell: ({ getValue }) => <span className="text-espresso">{getValue()}</span> },
  ];

  const exportCsv = () =>
    downloadCsv(
      toCsv(
        [
          ["at", "When (UTC)"],
          [who, "Who"],
          ["actorEmail", "Email"],
          [(e) => (e.actorRole ? roleName(e.actorRole) : ""), "Role"],
          [(e) => AREA[e.section] ?? e.section, "Area"],
          ["summary", "What happened"],
          ["outcome", "Outcome"],
        ],
        visible,
      ),
      "belioras-activity.csv",
    );

  return (
    <div className="space-y-5">
      <DashListToolbar
        actions={
          <Button icon={Download} size="sm" variant="secondary" onClick={exportCsv} className="h-10" disabled={!visible.length}>
            Export<span className="hidden sm:inline"> CSV</span>
          </Button>
        }
        tabs={tabs}
        tab={tab}
        onTabChange={setTab}
        tabsLabel="Activity"
        query={query}
        onQueryChange={setQuery}
        placeholder="Search what happened"
        controls={
          <>
            <DashSelect label="Person" value={person} onChange={setPerson} options={[{ value: "", label: "Everyone" }, ...people.map((p) => ({ value: p, label: p }))]} />
            <DashSelect label="Area" value={area} onChange={setArea} options={[{ value: "", label: "All areas" }, ...areas.map((a) => ({ value: a, label: AREA[a] ?? a }))]} />
          </>
        }
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      <DashTable
        columns={columns}
        data={visible}
        loading={loading}
        globalFilter={query}
        initialSorting={[{ id: "at", desc: true }]}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        unit={visible.length === 1 ? "entry" : "entries"}
        empty={{
          icon: History,
          title: entries.length ? "Nothing matches" : "Nothing recorded yet",
          description: entries.length
            ? "Try another person, area or search."
            : "Sign-ins and every change saved in the dashboard appear here from now on.",
        }}
      />
    </div>
  );
}

/** Two views: what people did in the dashboard, and the emails the shop has queued. */
export default function DashActivity() {
  const [params] = useSearchParams();
  const [view, setView] = useState(params.get("view") === "emails" ? "emails" : "activity");
  return (
    <div className="space-y-6">
      <DashTabs
        ariaLabel="Activity"
        options={[
          { value: "activity", label: "Activity" },
          { value: "emails", label: "Email outbox" },
        ]}
        value={view}
        onChange={setView}
      />
      {view === "activity" ? <ActivityLog /> : <EmailOutbox />}
    </div>
  );
}
