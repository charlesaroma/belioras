/* Admin Dashboard Page: Inventory - InventoryAdjustDialog */
import { useState } from "react";
import { ArrowRight } from "lucide-react";

import Modal from "@/components/common/Modal";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { useToast } from "@/context/ToastContext";
import { adjustStock } from "@/services/catalog/inventory/inventoryApi";
import { cn } from "@/utils/cn";
import { variantLabel } from "./inventoryRows";

const MODES = [
  { id: "add", label: "Add", reasons: ["received", "returned", "adjusted"], help: "Pieces that arrived or came back." },
  { id: "remove", label: "Remove", reasons: ["damaged", "adjusted"], help: "Pieces damaged, lost or taken off sale." },
  { id: "set", label: "Set count", reasons: ["counted"], help: "What a stock count found on the shelf." },
];
const REASON_LABELS = { received: "Received", returned: "Returned to stock", adjusted: "Correction", damaged: "Damaged or lost", counted: "Stock count" };

/** Changes one variant's on hand, with a reason for the history. Remount with a `key` per variant. */
export default function InventoryAdjustDialog({ row, taxonomy, by, onClose, onSaved }) {
  const { toast } = useToast();
  const [mode, setMode] = useState("add");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("received");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const current = MODES.find((m) => m.id === mode);
  const qty = Math.max(0, Math.floor(Number(quantity) || 0));
  const onHand = row ? (mode === "set" ? qty : mode === "remove" ? row.onHand - qty : row.onHand + qty) : 0;
  const ready = quantity !== "" && (mode === "set" || qty > 0);

  const chooseMode = (id) => {
    setMode(id);
    setReason(MODES.find((m) => m.id === id).reasons[0]);
    setError("");
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await adjustStock({ productId: row.productId, colorId: row.colorId, size: row.size, mode, quantity, reason, note, by });
      toast(`${row.name}: ${onHand} on hand.`, "success");
      onSaved();
    } catch (err) {
      const message = err.message ?? "Could not change that stock.";
      setError(message);
      toast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={Boolean(row)} onClose={onClose} title="Adjust stock">
      {row && (
        <form onSubmit={save} className="space-y-5">
          <div>
            <p className="font-medium text-espresso">{row.name}</p>
            <p className="text-[12px] text-espresso-soft">{variantLabel(row, taxonomy)}</p>
          </div>

          <div role="radiogroup" aria-label="Change" className="grid grid-cols-3 gap-px bg-umber-100">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={mode === m.id}
                onClick={() => chooseMode(m.id)}
                className={cn("min-h-11 text-[11px] uppercase tracking-[0.12em] transition-colors", mode === m.id ? "bg-espresso text-ivory-50" : "bg-ivory-50 text-espresso-soft hover:text-espresso")}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={mode === "set" ? "Count on the shelf" : "How many"} helper={current.help} required>
              <input type="number" min="0" inputMode="numeric" value={quantity} onChange={(e) => setQuantity(e.target.value)} autoFocus />
            </Field>
            <Field label="Reason">
              <select value={reason} onChange={(e) => setReason(e.target.value)} disabled={current.reasons.length === 1}>
                {current.reasons.map((r) => (
                  <option key={r} value={r}>{REASON_LABELS[r]}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Note (optional)" helper="Shown in the history, e.g. a delivery reference.">
            <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={140} />
          </Field>

          <dl className="grid grid-cols-2 gap-4 border border-umber-50 bg-ivory-500/60 p-4 text-[13px]">
            <Change label="On hand" from={row.onHand} to={ready ? onHand : row.onHand} />
            <Change label="Available" from={row.available} to={ready ? Math.max(0, onHand - row.reserved) : row.available} />
            {row.reserved > 0 && (
              <p className="col-span-2 text-[12px] text-espresso-soft">
                {row.reserved} {row.reserved === 1 ? "is" : "are"} held by open orders and ship from on hand.
              </p>
            )}
          </dl>

          {error && <p role="alert" className="text-[13px] text-error">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={saving} disabled={!ready} className="bg-espresso text-ivory-50 hover:bg-espresso-600">
              Save
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

function Change({ label, from, to }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.18em] text-espresso-soft">{label}</dt>
      <dd className="mt-1 flex items-center gap-2 font-display text-xl tabular-nums text-espresso">
        {from}
        {to !== from && (
          <>
            <ArrowRight className="size-4 text-espresso-soft" aria-hidden="true" />
            <span className={to < 0 ? "text-error" : ""}>{to}</span>
          </>
        )}
      </dd>
    </div>
  );
}
