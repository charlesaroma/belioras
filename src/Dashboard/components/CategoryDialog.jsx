/* Admin Dashboard: CategoryDialog */
import { useState } from "react";

import Modal from "@/components/common/Modal";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import ChoiceChips from "./ChoiceChips";

/**
 * Adds or edits one category: its name, the sizes it offers and the extra
 * details the product form asks for. Remount with a changing `key` per open.
 */
export default function CategoryDialog({
  open,
  initial = null,
  sizeOptions = [],
  detailOptions = [],
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    sizes: initial?.sizes ?? [],
    details: initial?.details ?? [],
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const toggle = (key) => (id) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(id) ? f[key].filter((v) => v !== id) : [...f[key], id],
    }));

  const submit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaving(true);
    setError("");
    try {
      // Sizes keep the taxonomy's order whatever order they were ticked in.
      const sizes = sizeOptions.map((s) => s.id).filter((id) => form.sizes.includes(id));
      await onSave({ ...form, sizes });
    } catch (err) {
      setError(err.message ?? "Could not save that category.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? `Edit ${initial.name}` : "New category"} width="max-w-lg">
      <form onSubmit={submit} className="space-y-6">
        <Field label="Name" required helper="What a piece is, such as Dresses, Hair or Shoes.">
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Shoes"
          />
        </Field>

        <ChoiceChips
          label="Sizes offered"
          hint="Leave all unticked for one-size pieces, such as bags or wigs."
          options={sizeOptions.map((s) => ({ id: s.id, label: s.name }))}
          selected={form.sizes}
          onToggle={toggle("sizes")}
        />

        <ChoiceChips
          label="Details to ask for"
          hint="Optional extras on the product form that help shoppers filter."
          options={detailOptions}
          selected={form.details}
          onToggle={toggle("details")}
        />

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
            {initial ? "Save category" : "Add category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
