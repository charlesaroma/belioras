/* Admin Dashboard Page: Categories - NewSubcategoryValueDialog */
import { useState } from "react";

import Modal from "@/components/common/Modal";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";

const NEW_COLUMN = "__new__";

/**
 * Creates a detail value (Occasion, Fabric, Style, Length, Hair) and drops it
 * straight into a menu column, in one step — composing what Categories &
 * Colours' Details tab and the Mega Menu page would otherwise take two trips
 * to do. Colour and Type keep their own dedicated create flows (Colours tab,
 * the category's own dialog) and are added to a column via "Add link" as
 * before, since each needs more than a name.
 */
export default function NewSubcategoryValueDialog({ open, dimensionOptions, sectionOptions, onClose, onSave }) {
  const [dimension, setDimension] = useState(dimensionOptions[0]?.id ?? "");
  const [name, setName] = useState("");
  const [sectionId, setSectionId] = useState(sectionOptions[0]?.value ?? NEW_COLUMN);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !dimension) return;
    setSaving(true);
    setError("");
    try {
      await onSave({ dimension, name: name.trim(), sectionId: sectionId === NEW_COLUMN ? null : sectionId });
      setName("");
    } catch (err) {
      setError(err.message ?? "Could not add that.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="New subcategory value" width="max-w-sm">
      <form onSubmit={submit} className="space-y-5">
        <Field label="Detail" required>
          <select value={dimension} onChange={(e) => setDimension(e.target.value)}>
            {dimensionOptions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Name" required helper="Shown as the link shoppers see, e.g. “Organza”.">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Organza" autoFocus />
        </Field>

        <Field label="Column" required helper="Which menu column this appears under.">
          <select value={sectionId} onChange={(e) => setSectionId(e.target.value)}>
            {sectionOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
            <option value={NEW_COLUMN}>New column…</option>
          </select>
        </Field>

        {error && (
          <p role="alert" className="border-l-2 border-error py-1 pl-3 text-[13px] text-error">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 border-t border-umber-50 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving} className="bg-espresso text-ivory-50 hover:bg-espresso-600">
            Add
          </Button>
        </div>
      </form>
    </Modal>
  );
}
