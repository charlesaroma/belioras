/* Admin Dashboard Page: Orders - OrdersPayments */
import { Link } from "react-router-dom";

import StatusChip from "../../../../../components/ui/StatusChip";
import { useLanguage } from "../../../../../context/LanguageContext";
import { useAsyncData } from "../../../../../hooks/useAsyncData";
import { getTransactionsForOrder } from "../../../../../services/transactionsApi";
import {
  TRANSACTION_TYPE,
  describeMethod,
  formatCharged,
} from "../../../../../utils/transactionStatus";

/** The money side of one order. Rendered only for people who hold `payments`. */
export default function OrdersPayments({ orderId }) {
  const { locale } = useLanguage();
  const { data, loading } = useAsyncData(() => getTransactionsForOrder(orderId), [orderId]);
  const items = data ?? [];

  const dateFmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="border-t border-umber-50 pt-4">
      <p className="eyebrow mb-3">Payments</p>

      {loading && <p className="text-[12px] text-espresso-soft">Loading payments…</p>}

      {!loading && items.length === 0 && (
        <p className="text-[12px] text-espresso-soft">No money has moved on this order.</p>
      )}

      {!loading && items.length > 0 && (
        <ul className="space-y-2.5">
          {items.map((t) => (
            <li key={t.id}>
              <Link
                to={`/dashboard/transactions?txn=${t.id}`}
                className="flex items-center justify-between gap-3 text-[13px] transition-colors hover:text-gold-700"
              >
                <span className="min-w-0">
                  <span className="block text-espresso">
                    {TRANSACTION_TYPE[t.type]} · {describeMethod(t.method)}
                  </span>
                  <span className="block text-[11px] text-espresso-soft">
                    {t.failureReason ?? dateFmt.format(new Date(t.createdAt))}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="tabular-nums">
                    {formatCharged(t.signedAmount, t.currency, locale)}
                  </span>
                  <StatusChip kind="transaction" status={t.displayStatus} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
