/* Admin Dashboard Page: Transactions - TransactionsDetailModal */
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy } from "lucide-react";

import Modal from "../../../../../components/common/Modal";
import StatusChip from "../../../../../components/ui/StatusChip";
import { useToast } from "@/context/ToastContext";
import {
  TRANSACTION_TYPE,
  describeMethod,
  formatCharged,
} from "../../../../../utils/transactionStatus";

const PROVIDER = { stripe: "Stripe", paypal: "PayPal" };

export default function TransactionsDetailModal({ transaction: t, related, onClose, onOpen, locale, dateFmt }) {
  const [copied, setCopied] = useState(null);
  const { toast } = useToast();
  const money = (amount, currency = t?.currency) => formatCharged(amount, currency, locale);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(t.providerRef);
      setCopied(t.id);
      setTimeout(() => setCopied(null), 1500);
      toast("Payment reference copied.", "success");
    } catch {
      // Clipboard refused; the reference is still selectable text.
      toast("Could not copy. Select the reference and copy it instead.", "error");
    }
  };

  return (
    <Modal
      open={Boolean(t)}
      onClose={onClose}
      title={t ? `${TRANSACTION_TYPE[t.type]} · ${t.orderId}` : "Transaction"}
      width="max-w-xl"
    >
      {t && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-umber-50 pb-4">
            <div>
              <p className="font-display text-3xl leading-none tabular-nums text-espresso">
                {money(t.signedAmount)}
              </p>
              <p className="mt-2 text-[12px] text-espresso-soft">{dateFmt.format(new Date(t.createdAt))}</p>
            </div>
            <StatusChip kind="transaction" status={t.displayStatus} />
          </div>

          {t.failureReason && (
            <p className="border-l-2 border-error py-1 pl-3 text-[13px] text-error">{t.failureReason}</p>
          )}

          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-[13px]">
            <dt className="text-espresso-soft">Transaction ID</dt>
            <dd className="flex min-w-0 items-center gap-2">
              <span className="break-all font-mono text-[12px] text-espresso">{t.providerRef}</span>
              <button
                type="button"
                onClick={copy}
                aria-label={copied === t.id ? "Copied" : "Copy transaction ID"}
                className="shrink-0 text-espresso/40 transition-colors hover:text-espresso"
              >
                {copied === t.id ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
              </button>
            </dd>
            <Row label="Provider" value={PROVIDER[t.provider] ?? t.provider} />
            <Row label="Method" value={describeMethod(t.method)} />
            <Row label="Customer" value={t.email ? `${t.customer} · ${t.email}` : t.customer} />
            {t.type === "charge" && t.status === "succeeded" && (
              <>
                <Row label="Provider fee" value={money(t.fee)} />
                <Row label="Net" value={money(t.net)} />
                {t.refunded > 0 && <Row label="Refunded so far" value={money(t.refunded)} />}
              </>
            )}
          </dl>

          <Link
            to={`/dashboard/orders?order=${encodeURIComponent(t.orderId)}`}
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-700 transition-colors hover:text-espresso"
          >
            Open order {t.orderId}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>

          {related.length > 0 && (
            <div className="border-t border-umber-50 pt-4">
              <p className="eyebrow mb-3">Also on this order</p>
              <ul className="space-y-2">
                {related.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => onOpen(r)}
                      className="flex w-full items-center justify-between gap-3 text-left text-[13px] transition-colors hover:text-gold-700"
                    >
                      <span>
                        {TRANSACTION_TYPE[r.type]} · {dateFmt.format(new Date(r.createdAt))}
                      </span>
                      <span className="flex shrink-0 items-center gap-3">
                        <span className="tabular-nums">{money(r.signedAmount, r.currency)}</span>
                        <StatusChip kind="transaction" status={r.displayStatus} />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="border-t border-umber-50 pt-4 text-[11px] text-espresso-soft">
            Read-only for now. Refunds will be issued from here once Stripe or PayPal is connected,
            because a refund has to go through the provider.
          </p>
        </div>
      )}
    </Modal>
  );
}

function Row({ label, value }) {
  return (
    <>
      <dt className="text-espresso-soft">{label}</dt>
      <dd className="text-espresso">{value}</dd>
    </>
  );
}
