/* Admin Dashboard: DetailValueDialog */
import { useState } from "react";

import Modal from "@/components/common/Modal";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { useToast } from "@/context/ToastContext";

/**
 * Adds or renames one value within a detail dimension (Occasion, Fabric,
 * Style, Length, Hair) — just a name. Remount with a changing `key` per open.
 */
export default function DetailValueDialog({ open, dimensionLabel, initial = null, onClose, onSave }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const submit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaving(true);
    setError("");
    try {
      await onSave(name);
    } catch (err) {
      const message = err.message ?? "Could not save that.";
      setError(message);
      toast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? `Rename "${initial.name}"` : `New ${dimensionLabel} value`} width="max-w-sm">
      <form onSubmit={submit} className="space-y-5">
        <Field label="Name" required helper="What shoppers filter by and see on the product form.">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Graduation" autoFocus />
        </Field>

        {error && (
          <p role="alert" className="border-l-2 border-error py-1 pl-3 text-[13px] text-error">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 border-t border-umber-50 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving} className="bg-espresso text-ivory-50 hover:bg-espresso-600">
            {initial ? "Save" : "Add"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
