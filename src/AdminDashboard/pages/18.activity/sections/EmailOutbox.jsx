/* Admin Dashboard Page: Activity - EmailOutbox */
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { useAsyncData } from "@/hooks/useAsyncData";
import { EMAIL_TYPES, getEmails } from "@/services/notifications/emailsApi";
import DashSelect from "../../../components/DashSelect";
import DashTable from "../../../components/DashTable";
import DashToolbar from "../../../components/DashToolbar";

/**
 * Every email the shop has sent, waiting for the backend's mailer. Nothing is
 * delivered from the browser; once email is connected the server sends these
 * — and everything after them — itself. Below, the full list of emails the
 * shop sends and what triggers each, for whoever builds the templates.
 */
export default function EmailOutbox() {
  const { locale } = useLanguage();
  const { data, loading } = useAsyncData(getEmails, []);
  const emails = useMemo(() => data ?? [], [data]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const timeFmt = useMemo(() => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }), [locale]);

  const visible = emails.filter((e) => !type || e.type === type);
  const columns = [
    { accessorKey: "createdAt", header: "Queued", cell: ({ getValue }) => <span className="whitespace-nowrap tabular-nums text-espresso-soft">{timeFmt.format(new Date(getValue()))}</span> },
    { id: "type", accessorFn: (e) => EMAIL_TYPES[e.type]?.label ?? e.type, header: "Email", cell: ({ getValue }) => <span className="text-espresso">{getValue()}</span> },
    { accessorKey: "to", header: "To", cell: ({ getValue }) => <span className="text-espresso-soft">{getValue()}</span> },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => (
        <span className="text-espresso">
          {row.original.subject}
          {row.original.orderId && (
            <Link to={`/dashboard/orders?order=${row.original.orderId}`} className="ml-2 text-[11px] text-gold-800 underline underline-offset-4" onClick={(e) => e.stopPropagation()}>
              {row.original.orderId}
            </Link>
          )}
        </span>
      ),
    },
    { accessorKey: "status", header: "Status", cell: () => <span className="bg-gold-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-gold-800">Queued</span> },
  ];

  return (
    <div className="space-y-5">
      <p className="flex items-start gap-3 border border-umber-100 bg-ivory-50 px-4 py-3 text-[13px] leading-relaxed text-espresso-soft">
        <Mail className="mt-0.5 size-4 shrink-0 text-gold-700" aria-hidden="true" />
        Email isn&rsquo;t connected yet, so nothing below has been delivered. Each flow records its email here with everything the
        template needs; once the backend&rsquo;s mailer is connected it sends them from a Belioras address.
      </p>

      <DashToolbar
        query={query}
        onQueryChange={setQuery}
        placeholder="Search recipient or subject"
        filters={
          <DashSelect
            label="Email"
            value={type}
            onChange={setType}
            options={[{ value: "", label: "Every email" }, ...Object.entries(EMAIL_TYPES).map(([value, t]) => ({ value, label: t.label }))]}
          />
        }
      />

      <DashTable
        tableId="email-outbox"
        columns={columns}
        data={visible}
        loading={loading}
        globalFilter={query}
        initialSorting={[{ id: "createdAt", desc: true }]}
        unit={visible.length === 1 ? "email" : "emails"}
        empty={{ icon: Mail, title: emails.length ? "Nothing matches" : "No emails yet", description: "Emails appear here as orders, sign-ups and invitations happen." }}
      />

      <section className="border border-umber-50 bg-ivory-50">
        <h2 className="border-b border-umber-50 px-5 py-4 font-display text-xl text-espresso">Every email the shop sends</h2>
        <ul className="divide-y divide-umber-50">
          {Object.entries(EMAIL_TYPES).map(([id, t]) => (
            <li key={id} className="grid gap-1 px-5 py-3 text-[13px] sm:grid-cols-[14rem_8rem_minmax(0,1fr)] sm:gap-4">
              <span className="text-espresso">{t.label}</span>
              <span className="text-espresso-soft">{t.audience}</span>
              <span className="text-espresso-soft">{t.when}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
