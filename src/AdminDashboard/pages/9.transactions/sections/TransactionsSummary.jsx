/* Admin Dashboard Page: Transactions - TransactionsSummary */
import { AlertTriangle, ArrowDownLeft, Landmark, Wallet } from "lucide-react";

import { formatCharged } from "../../../../utils/transactionStatus";
import StatCard from "../../../components/StatCard";
import { summarize } from "./transactionsFilters";

export default function TransactionsSummary({ transactions, loading, locale }) {
  const s = summarize(transactions);

  const money = (amount) => {
    if (loading) return "—";
    return s.currency ? formatCharged(amount, s.currency, locale) : "Mixed";
  };

  const count = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  return (
    <section aria-label="Money summary">
      <div className="grid gap-px border border-umber-50 bg-umber-50 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Collected"
          value={money(s.collected)}
          hint={count(s.paymentCount, "payment", "payments")}
          icon={Wallet}
        />
        <StatCard
          label="Refunded"
          value={money(s.refunded)}
          hint={count(s.refundCount, "refund", "refunds")}
          icon={ArrowDownLeft}
        />
        <StatCard label="Net" value={money(s.net)} hint={`after ${money(s.fees)} in fees`} icon={Landmark} />
        <StatCard
          label="Failed payments"
          value={loading ? "—" : String(s.failedCount)}
          hint={s.failedCount ? "worth following up" : "none to chase"}
          icon={AlertTriangle}
        />
      </div>
    </section>
  );
}
