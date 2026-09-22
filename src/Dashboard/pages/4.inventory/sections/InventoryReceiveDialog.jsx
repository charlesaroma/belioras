/* Admin Dashboard Page: Inventory - InventoryReceiveDialog */
import { useState } from "react";

import Modal from "@/components/common/Modal";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { useToast } from "@/context/ToastContext";
import { receiveStock } from "@/services/catalog/inventory/inventoryApi";

/** A delivery for several variants at once: the same number added to each selected. */
export default function InventoryReceiveDialog({ open, ids, by, onClose, onSaved }) {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const count = ids.length;

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await receiveStock(ids, quantity, { note, by });
      toast(`${quantity} added to each of ${count} ${count === 1 ? "variant" : "variants"}.`, "success");
      onSaved();
    } catch (err) {
      toast(err.message ?? "Could not receive that stock.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Receive stock">
      <form onSubmit={save} className="space-y-5">
        <p className="text-[13px] text-espresso-soft">
          Adds the same number to each of the {count} selected {count === 1 ? "variant" : "variants"}, recorded as received.
        </p>
        <Field label="Pieces received for each" required>
          <input type="number" min="1" inputMode="numeric" value={quantity} onChange={(e) => setQuantity(e.target.value)} autoFocus />
        </Field>
        <Field label="Note (optional)" helper="A delivery or supplier reference, shown in the history.">
          <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={140} />
        </Field>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving} disabled={!(Number(quantity) > 0)} className="bg-espresso text-ivory-50 hover:bg-espresso-600">
            Receive
          </Button>
        </div>
      </form>
    </Modal>
  );
}
