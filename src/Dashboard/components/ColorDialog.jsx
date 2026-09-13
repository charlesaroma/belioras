/* Admin Dashboard: ColorDialog */
import { useState } from "react";

import Modal from "@/components/common/Modal";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";

const EMPTY = { name: "", hex: "#120700", family: "" };

/**
 * Adds or edits one colour. Used on Categories & Colours and, for a colour
 * that is not in the list yet, straight from the product form.
 *
 * Remount it (a changing `key`) to start from fresh values each time it opens.
 */
export default function ColorDialog({ open, initial = null, families = [], onClose, onSave }) {
  const [form, setForm] = useState(initial ?? EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const swatch = /^#[0-9a-f]{6}$/i.test(form.hex) ? form.hex : "#000000";

  const submit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaving(true);
    setError("");
    try {
      await onSave(form);
    } catch (err) {
      setError(err.message ?? "Could not save that colour.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? `Edit ${initial.name}` : "New colour"} width="max-w-md">
      <form onSubmit={submit} className="space-y-5">
        <Field label="Name" required helper="What shoppers see on the product, such as Ebony or Champagne.">
          <input value={form.name} onChange={set("name")} placeholder="Ebony" />
        </Field>

        <div>
          <p className="input-label">Swatch</p>
          <div className="flex items-center gap-3">
            <input
              type="color"
              aria-label="Pick the swatch colour"
              value={swatch}
              onChange={set("hex")}
              className="h-12 w-16 shrink-0 cursor-pointer border border-umber-100 bg-white p-1"
            />
            <input
              aria-label="Swatch hex code"
              value={form.hex}
              onChange={set("hex")}
              maxLength={7}
              className="input font-mono uppercase"
            />
          </div>
        </div>

        <Field label="Shop filter" required helper="The colour a shopper filters by to find it.">
          <select value={form.family} onChange={set("family")}>
            <option value="" disabled>
              Choose a filter colour
            </option>
            {families.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
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
            {initial ? "Save colour" : "Add colour"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
