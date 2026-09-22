/* Admin Dashboard Page: Inventory - InventoryThreshold */
import { useState } from "react";

import Modal from "@/components/common/Modal";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { useToast } from "@/context/ToastContext";
import { setLowStockThreshold } from "@/services/catalog/inventory/inventoryApi";

/** "Low stock at 3 or fewer · Change": the shop-wide line. A piece may set its own in its form. */
export default function InventoryThreshold({ value, onSaved }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const n = await setLowStockThreshold(draft);
      toast(`Low stock now means ${n} or fewer left.`, "success");
      setOpen(false);
      onSaved();
    } catch (err) {
      toast(err.message ?? "Could not save that threshold.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <p className="text-[12px] text-espresso-soft">
        Low stock at <span className="tabular-nums text-espresso">{value}</span> or fewer left{" "}
        <button
          type="button"
          onClick={() => {
            setDraft(String(value));
            setOpen(true);
          }}
          className="ml-1 text-gold-700 underline underline-offset-4 transition-colors hover:text-espresso"
        >
          Change
        </button>
      </p>

      <Modal open={open} onClose={() => setOpen(false)} title="Low-stock alert">
        <form onSubmit={save} className="space-y-5">
          <Field
            label="Mark a variant low when this many or fewer are left"
            helper="Counts what shoppers can still buy. A piece can set its own number in its product form."
            required
          >
            <input type="number" min="0" max="999" inputMode="numeric" value={draft} onChange={(e) => setDraft(e.target.value)} autoFocus />
          </Field>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving} className="bg-espresso text-ivory-50 hover:bg-espresso-600">Save</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
