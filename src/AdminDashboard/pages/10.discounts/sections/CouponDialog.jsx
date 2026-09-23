/* Admin Dashboard Page: Discounts - CouponDialog */
import { useState } from "react";

import Modal from "@/components/common/Modal";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { useToast } from "@/context/ToastContext";

const TYPES = [
  { value: "percent", label: "Percent off" },
  { value: "fixed", label: "Fixed amount off" },
  { value: "free_shipping", label: "Free shipping" },
];

function toDateInput(iso) {
  return iso ? iso.slice(0, 10) : "";
}

function toIso(dateInput) {
  return dateInput ? `${dateInput}T23:59:59Z` : null;
}

/** Create or edit one coupon. Global-only: no product or category scoping. */
export default function CouponDialog({ open, initial = null, onClose, onSave }) {
  const [form, setForm] = useState({
    code: initial?.code ?? "",
    type: initial?.type ?? "percent",
    value: initial?.value ?? "",
    minOrderValue: initial?.minOrderValue ?? "",
    maxDiscount: initial?.maxDiscount ?? "",
    expiresAt: toDateInput(initial?.expiresAt),
    active: initial?.active ?? true,
    description: initial?.description ?? "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave({ ...form, expiresAt: toIso(form.expiresAt) });
    } catch (err) {
      const message = err.message ?? "Could not save that coupon.";
      setError(message);
      toast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? `Edit ${initial.code}` : "New coupon"} width="max-w-lg">
      <form onSubmit={submit} className="space-y-5">
        <Field label="Code" required helper="What a shopper types at checkout. Kept uppercase.">
          <input
            value={form.code}
            onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
            placeholder="e.g. SUMMER20"
            autoFocus
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Gives" required>
            <select value={form.type} onChange={set("type")}>
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>

          {form.type !== "free_shipping" && (
            <Field
              label={form.type === "percent" ? "Percent" : "Amount (€)"}
              required
              helper={form.type === "percent" ? "1–100" : undefined}
            >
              <input
                type="number"
                min="0"
                max={form.type === "percent" ? 100 : undefined}
                value={form.value}
                onChange={set("value")}
              />
            </Field>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Minimum order (€)" helper="Leave at 0 for no minimum.">
            <input type="number" min="0" value={form.minOrderValue} onChange={set("minOrderValue")} />
          </Field>

          {form.type === "percent" && (
            <Field label="Maximum discount (€)" helper="Leave blank for no cap.">
              <input type="number" min="0" value={form.maxDiscount} onChange={set("maxDiscount")} />
            </Field>
          )}
        </div>

        <Field label="Expires" helper="Leave blank for a code that never expires.">
          <input type="date" value={form.expiresAt} onChange={set("expiresAt")} />
        </Field>

        <Field label="Description" helper="Shown to staff only — what this coupon is for.">
          <textarea rows={2} value={form.description} onChange={set("description")} />
        </Field>

        <label className="flex items-center gap-2 text-[13px] text-espresso">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
            className="size-4"
          />
          Active — shoppers can redeem this code
        </label>

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
            {initial ? "Save changes" : "Add coupon"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
