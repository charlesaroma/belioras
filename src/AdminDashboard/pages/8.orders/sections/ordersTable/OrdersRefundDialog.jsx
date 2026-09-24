/* Admin Dashboard Page: Orders - OrdersRefundDialog */
import { useMemo, useState } from "react";

import Modal from "@/components/common/Modal";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Toggle from "@/AdminDashboard/components/Toggle";
import { refundQuote } from "@/services/sales/ordersApi";
import QuantitySelector from "@/components/shared/QuantitySelector";

const eur = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const REASONS = ["Returned unworn", "Arrived damaged", "Wrong size or colour sent", "Goodwill", "Other"];

/**
 * Refund all or part of a paid order. Pick the pieces (each worth what was
 * actually paid for it, after any discount), add shipping if it goes back
 * too, or set an amount by hand; say why; and say whether the pieces are back
 * on the shelf. A credit note is issued and the customer is emailed.
 * Remount with a `key` per order.
 */
export default function OrdersRefundDialog({ order, onClose, onRefund }) {
  const quote = useMemo(() => (order ? refundQuote(order) : null), [order]);
  const [qty, setQty] = useState(() => Object.fromEntries((quote?.lines ?? []).map((l) => [l.index, 0])));
  const [includeShipping, setIncludeShipping] = useState(false);
  const [custom, setCustom] = useState("");
  const [reason, setReason] = useState(REASONS[0]);
  const [note, setNote] = useState("");
  const [restock, setRestock] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  if (!order || !quote) return null;
  const shipped = Boolean(order.stockDeductedAt);
  const fromLines = quote.lines.reduce((s, l) => s + l.unitPaid * (qty[l.index] ?? 0), 0) + (includeShipping ? quote.shipping : 0);
  const amount = custom === "" ? Math.round(fromLines * 100) / 100 : Number(custom);
  const chooseAll = () => {
    setQty(Object.fromEntries(quote.lines.map((l) => [l.index, l.quantity])));
    setIncludeShipping(quote.shipping > 0);
    setCustom("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onRefund({
        lines: quote.lines.map((l) => ({ index: l.index, quantity: qty[l.index] ?? 0 })),
        includeShipping,
        amount: custom === "" ? null : custom,
        reason: reason === "Other" ? note.trim() || "Other" : note.trim() ? `${reason} — ${note.trim()}` : reason,
        restock: shipped && restock,
      });
    } catch (err) {
      setError(err.message ?? "Could not make that refund.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={Boolean(order)} onClose={onClose} title={`Refund ${order.id}`} width="max-w-2xl">
      <form onSubmit={submit} className="space-y-6">
        <dl className="grid grid-cols-3 gap-px border border-umber-50 bg-umber-50 text-center text-[12px]">
          {[["Paid", quote.charged], ["Refunded so far", quote.refunded], ["Can refund", quote.refundable]].map(([label, value]) => (
            <div key={label} className="bg-ivory-50 px-3 py-3">
              <dt className="text-espresso-soft">{label}</dt>
              <dd className="mt-1 font-display text-xl tabular-nums text-espresso">{eur.format(value)}</dd>
            </div>
          ))}
        </dl>

        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <p className="input-label mb-0">What is being refunded</p>
            <button type="button" onClick={chooseAll} className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-800 hover:text-espresso">Everything</button>
          </div>
          <ul className="divide-y divide-umber-50 border border-umber-50 bg-white">
            {quote.lines.map((l) => (
              <li key={l.index} className="flex flex-wrap items-center gap-3 px-4 py-3 text-[13px]">
                <div className="min-w-0 flex-1">
                  <p className="text-espresso">{l.name}</p>
                  <p className="text-[12px] text-espresso-soft">{[l.color, l.size && (l.size === "one-size" ? "One size" : `Size ${String(l.size).toUpperCase()}`)].filter(Boolean).join(" · ")} · {eur.format(l.unitPaid)} paid each</p>
                </div>
                <QuantitySelector value={qty[l.index] ?? 0} min={0} max={l.quantity} onChange={(v) => { setQty((q) => ({ ...q, [l.index]: v })); setCustom(""); }} />
              </li>
            ))}
            {quote.shipping > 0 && (
              <li className="px-4 py-2">
                <Toggle checked={includeShipping} onChange={(on) => { setIncludeShipping(on); setCustom(""); }} label={`Shipping · ${eur.format(quote.shipping)}`} />
              </li>
            )}
          </ul>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Refund amount (€)" helper={custom === "" ? "Worked out from what you picked. Type to set it by hand." : `Worked out: ${eur.format(fromLines)}`}>
            <input type="number" min="0" step="0.01" max={quote.refundable} value={custom === "" ? amount.toFixed(2) : custom} onChange={(e) => setCustom(e.target.value)} />
          </Field>
          <Field label="Reason">
            <select value={reason} onChange={(e) => setReason(e.target.value)}>
              {REASONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Note (optional)" helper="Shown on the credit note and in the activity log.">
          <input value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>

        {shipped ? (
          <Toggle checked={restock} onChange={setRestock} label="The pieces are back on the shelf" description="Puts the refunded pieces back into stock. Leave off if they are not back, or not sellable." />
        ) : (
          <p className="text-[12px] text-espresso-soft">This order hasn&rsquo;t shipped, so its pieces never left stock.</p>
        )}

        {error && <p role="alert" className="border-l-2 border-error py-1 pl-3 text-[13px] text-error">{error}</p>}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-umber-50 pt-4">
          <p className="text-[12px] text-espresso-soft">A credit note is issued and the customer is emailed.</p>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={saving} disabled={!(amount > 0) || amount > quote.refundable + 0.001} className="bg-error border-error text-white hover:bg-error/90">
              Refund {amount > 0 ? eur.format(amount) : ""}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
