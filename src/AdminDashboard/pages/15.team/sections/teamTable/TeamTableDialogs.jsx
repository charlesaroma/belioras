/* Admin Dashboard Page: Team - TeamTableDialogs */
import { useState } from "react";
import { Check, Copy } from "lucide-react";

import Modal from "../../../../../components/common/Modal";
import Button from "../../../../../components/ui/Button";
import ConfirmDialog from "../../../../../components/ui/ConfirmDialog";
import Field from "../../../../../components/ui/Field";
import { cn } from "../../../../../utils/cn";
import { roleLabel } from "./teamTableRoles";

export function RoleChangeDialog({ pending, onClose, onConfirm }) {

  const removing = pending?.role === "customer";

  return (
    <ConfirmDialog
      open={Boolean(pending)}
      onClose={onClose}
      onConfirm={onConfirm}
      destructive={removing}
      title={removing ? "Remove atelier access?" : "Change this role?"}
      description={
        removing
          ? "They keep their account and order history, but lose the dashboard entirely."
          : "Administrators can see and edit every order, customer and piece, and can change who else has access."
      }
      summary={
        pending && (
          <span>
            <strong className="font-medium">{pending.user.name}</strong>
            {removing ? " becomes a customer again" : ` becomes ${roleLabel(pending.role)}`}
          </span>
        )
      }
      confirmLabel={removing ? "Remove access" : "Change role"}
    />
  );
}

const ROLE_CHOICES = [
  { value: "staff", label: "Staff", blurb: "Catalogue, orders, content and marketing." },
  { value: "super-admin", label: "Administrator", blurb: "Everything, plus the team, payments and settings." },
];

/** A memorable-enough temporary password: three word-ish chunks and digits. */
function temporaryPassword() {
  const chunk = () => Math.random().toString(36).slice(2, 6);
  return `${chunk()}-${chunk()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

/**
 * Add a team member directly: name, email, role and a temporary password. An
 * email that already has an account is just given access. After creating, the
 * dialog shows the sign-in details once so they can be passed on.
 * Remount with a `key` per opening.
 */
export function AddMemberDialog({ open, onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", email: "", role: "staff", password: temporaryPassword() });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(null);
  const [copied, setCopied] = useState(false);
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const result = await onAdd(form);
      setDone({ ...result, password: form.password });
    } catch (err) {
      setError(err.message ?? "Could not add that person.");
    } finally {
      setSaving(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`Email: ${done.user.email}\nTemporary password: ${done.password}`);
      setCopied(true);
    } catch {
      setError("Could not copy — select the details and copy them by hand.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={done ? "Team member added" : "Add a team member"} width="max-w-md">
      {done ? (
        <div className="space-y-5">
          <p className="text-[14px] leading-relaxed text-espresso-soft">
            {done.created
              ? `${done.user.name} can sign in at the atelier door now. Pass these details on — the password is shown only here.`
              : `${done.user.name} already had an account and now has ${roleLabel(done.user.role)} access. They sign in with their own password.`}
          </p>
          {done.created && (
            <dl className="space-y-2 border border-umber-50 bg-brown-50/40 px-4 py-3 text-[13px]">
              <div className="flex justify-between gap-3"><dt className="text-espresso-soft">Email</dt><dd className="font-mono text-espresso">{done.user.email}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-espresso-soft">Temporary password</dt><dd className="font-mono text-espresso">{done.password}</dd></div>
            </dl>
          )}
          {error && <p role="alert" className="text-[13px] text-error">{error}</p>}
          <div className="flex justify-end gap-2 border-t border-umber-50 pt-4">
            {done.created && (
              <Button variant="secondary" icon={copied ? Check : Copy} onClick={copy}>
                {copied ? "Copied" : "Copy details"}
              </Button>
            )}
            <Button onClick={onClose}>Done</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          <Field label="Name" required>
            <input value={form.name} onChange={set("name")} autoComplete="off" autoFocus />
          </Field>
          <Field label="Email" required helper="If this email already has an account, it is given access and no password is set.">
            <input type="email" value={form.email} onChange={set("email")} autoComplete="off" />
          </Field>

          <div>
            <p className="input-label">Role</p>
            <div role="radiogroup" aria-label="Role" className="grid gap-2">
              {ROLE_CHOICES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  role="radio"
                  aria-checked={form.role === r.value}
                  onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                  className={cn(
                    "border px-4 py-3 text-left transition-colors",
                    form.role === r.value ? "border-espresso bg-brown-50/50" : "border-umber-100 hover:border-espresso/50",
                  )}
                >
                  <span className="block text-[14px] text-espresso">{r.label}</span>
                  <span className="block text-[12px] text-espresso-soft">{r.blurb}</span>
                </button>
              ))}
            </div>
          </div>

          <Field label="Temporary password" helper="At least 8 characters. They should change it after signing in.">
            <div className="flex gap-2">
              <input value={form.password} onChange={set("password")} className="flex-1 font-mono" autoComplete="off" />
              <Button variant="secondary" onClick={() => setForm((f) => ({ ...f, password: temporaryPassword() }))}>
                New
              </Button>
            </div>
          </Field>

          {error && <p role="alert" className="border-l-2 border-error py-1 pl-3 text-[13px] text-error">{error}</p>}

          <div className="flex justify-end gap-2 border-t border-umber-50 pt-4">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={saving}>Add to team</Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
