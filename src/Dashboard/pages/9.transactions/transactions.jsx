/* Admin Dashboard Page: Transactions - transactions */
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CreditCard } from "lucide-react";

import { useLanguage } from "../../../context/LanguageContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getTransactions } from "../../../services/sales/transactionsApi";
import DashTable from "../../components/DashTable";
import TransactionsSummary from "./sections/TransactionsSummary";
import { PERIODS, VIEWS, matchesView } from "./sections/transactionsFilters";
import TransactionsDetailModal from "./sections/transactionsTable/TransactionsDetailModal";
import TransactionsToolbar from "./sections/transactionsTable/TransactionsTableToolbar";
import { buildTransactionColumns } from "./sections/transactionsTable/transactionsTableColumns";

export default function DashTransactions() {
  const { locale } = useLanguage();
  const { data, loading } = useAsyncData(getTransactions, []);
  const [params, setParams] = useSearchParams();

  const [query, setQuery] = useState("");
  const [view, setView] = useState("all");
  const [provider, setProvider] = useState("all");
  const [period, setPeriod] = useState("all");

  const rows = useMemo(() => data ?? [], [data]);

  // Provider and period scope everything below them: the summary, the tab
  // counts and the table all describe the same slice.
  const scoped = useMemo(() => {
    const since = PERIODS[period].since();
    return rows.filter(
      (t) =>
        (provider === "all" || t.provider === provider) &&
        (!since || new Date(t.createdAt) >= since),
    );
  }, [rows, provider, period]);

  const visible = useMemo(() => scoped.filter((t) => matchesView(t, view)), [scoped, view]);

  const tabs = useMemo(
    () =>
      VIEWS.map((v) => ({
        value: v.value,
        label: v.label,
        count: scoped.filter((t) => matchesView(t, v.value)).length,
      })),
    [scoped],
  );

  // The open transaction lives in the URL, so an order can link straight to it.
  const viewing = rows.find((t) => t.id === params.get("txn")) ?? null;
  const setOpen = (t) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (t) next.set("txn", t.id);
        else next.delete("txn");
        return next;
      },
      { replace: !t },
    );

  const dateFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [locale],
  );

  const columns = useMemo(() => buildTransactionColumns({ locale, dateFmt }), [locale, dateFmt]);
  const narrowed = Boolean(query) || view !== "all" || provider !== "all" || period !== "all";

  return (
    <div className="space-y-6">
      <TransactionsSummary transactions={scoped} loading={loading} locale={locale} />

      <TransactionsToolbar
        query={query}
        onQueryChange={setQuery}
        tabs={tabs}
        view={view}
        onViewChange={setView}
        provider={provider}
        onProviderChange={setProvider}
        period={period}
        onPeriodChange={setPeriod}
      />

      <DashTable
        columns={columns}
        data={visible}
        loading={loading}
        globalFilter={query}
        initialSorting={[{ id: "createdAt", desc: true }]}
        onRowClick={setOpen}
        unit={visible.length === 1 ? "transaction" : "transactions"}
        empty={{
          icon: CreditCard,
          title: narrowed ? "No transactions match" : "No transactions yet",
          description: narrowed
            ? "Try another reference, or widen the filters."
            : "Payments and refunds appear here once customers pay for orders.",
        }}
      />

      <TransactionsDetailModal
        transaction={viewing}
        related={viewing ? rows.filter((t) => t.orderId === viewing.orderId && t.id !== viewing.id) : []}
        onClose={() => setOpen(null)}
        onOpen={setOpen}
        locale={locale}
        dateFmt={dateFmt}
      />
    </div>
  );
}
