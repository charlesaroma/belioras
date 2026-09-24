/* Admin Dashboard Page: Team - RoleEditorDialog */
import { useState } from "react";
import { Lock } from "lucide-react";

import Modal from "@/components/common/Modal";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { cn } from "@/utils/cn";
import { SECTIONS, levelIn } from "@/utils/permissions";

const LEVEL_LABEL = { none: "No access", view: "View", edit: "Edit" };
const GROUPS = [...new Set(SECTIONS.map((s) => s.group))];

/** None / View / Edit for one section, as one control. */
function LevelControl({ section, value, onChange, disabled }) {
  const levels = section.readOnly ? ["none", "view"] : ["none", "view", "edit"];
  return (
    <div role="radiogroup" aria-label={`${section.label} access`} className="inline-flex border border-umber-100 bg-white">
      {levels.map((level) => {
        const on = value === level;
        return (
          <button
            key={level}
            type="button"
            role="radio"
            aria-checked={on}
            disabled={disabled}
            onClick={() => onChange(level)}
            className={cn(
              "min-h-9 min-w-[4.5rem] px-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors disabled:cursor-not-allowed",
              on
                ? level === "none"
                  ? "bg-umber-50 text-espresso"
                  : level === "view"
                    ? "bg-gold-500/25 text-gold-900"
                    : "bg-espresso text-ivory-50"
                : "text-espresso-soft hover:text-espresso",
            )}
          >
            {LEVEL_LABEL[level]}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Create or edit a role: a name, a line saying what it is for, and a level for
 * every dashboard section. "View" shows the section but refuses every change;
 * "No access" hides it from the sidebar entirely. The locked Administrator
 * role opens read-only. Remount with a `key` per opening.
 */
export default function RoleEditorDialog({ open, role, roles, onClose, onSave }) {
  const locked = Boolean(role?.locked);
  const [form, setForm] = useState(() => ({
    name: role?.name ?? "",
    description: role?.description ?? "",
    permissions: Object.fromEntries(SECTIONS.map((s) => [s.id, role ? levelIn(role, s.id) : "none"])),
  }));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const setLevel = (id, level) => setForm((f) => ({ ...f, permissions: { ...f.permissions, [id]: level } }));
  const setAll = (level) =>
    setForm((f) => ({ ...f, permissions: Object.fromEntries(SECTIONS.map((s) => [s.id, s.readOnly && level === "edit" ? "view" : level])) }));
  const startFrom = (id) => {
    const source = roles.find((r) => r.id === id);
    if (source) setForm((f) => ({ ...f, permissions: Object.fromEntries(SECTIONS.map((s) => [s.id, levelIn(source, s.id)])) }));
  };

  const counts = Object.values(form.permissions).reduce((c, l) => ({ ...c, [l]: (c[l] ?? 0) + 1 }), {});

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave(form);
    } catch (err) {
      setError(err.message ?? "Could not save that role.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={locked ? role.name : role ? `Edit ${role.name}` : "New role"} width="max-w-3xl">
      <form onSubmit={submit} className="space-y-6">
        {locked ? (
          <p className="flex items-start gap-3 border border-umber-100 bg-brown-50/40 px-4 py-3 text-[13px] text-espresso-soft">
            <Lock className="mt-0.5 size-4 shrink-0 text-gold-700" aria-hidden="true" />
            Administrators always have every section, so the shop can never be left without someone able to manage it.
            This role can&rsquo;t be edited or deleted.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <Field label="Role name" required>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Stock keeper" autoFocus />
            </Field>
            <Field label="What it's for">
              <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Receives deliveries and keeps counts right" />
            </Field>
          </div>
        )}

        <div>
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="input-label mb-0">What this role can see and change</p>
              <p className="text-[12px] text-espresso-soft">
                {counts.edit ?? 0} to change · {counts.view ?? 0} view only · {counts.none ?? 0} hidden
              </p>
            </div>
            {!locked && (
              <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.12em]">
                <select onChange={(e) => e.target.value && startFrom(e.target.value)} value="" aria-label="Start from another role" className="input h-9 w-auto py-1 text-[12px] normal-case tracking-normal">
                  <option value="">Start from a role…</option>
                  {roles.filter((r) => r.id !== role?.id).map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                <button type="button" onClick={() => setAll("view")} className="font-semibold text-gold-800 hover:text-espresso">All view</button>
                <button type="button" onClick={() => setAll("none")} className="font-semibold text-espresso-soft hover:text-espresso">Clear</button>
              </div>
            )}
          </div>

          <div className="divide-y divide-umber-50 border border-umber-50 bg-ivory-50">
            {GROUPS.map((group) => (
              <div key={group} className="px-4 py-3">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-700">{group}</p>
                <ul className="space-y-2">
                  {SECTIONS.filter((s) => s.group === group).map((s) => (
                    <li key={s.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
                      <span className="text-[13px] text-espresso">
                        {s.label}
                        {s.readOnly && <span className="ml-2 text-[11px] text-espresso-soft">read-only section</span>}
                      </span>
                      <LevelControl section={s} value={form.permissions[s.id]} onChange={(l) => setLevel(s.id, l)} disabled={locked} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {error && <p role="alert" className="border-l-2 border-error py-1 pl-3 text-[13px] text-error">{error}</p>}

        <div className="flex justify-end gap-2 border-t border-umber-50 pt-4">
          <Button variant="ghost" onClick={onClose}>{locked ? "Close" : "Cancel"}</Button>
          {!locked && <Button type="submit" loading={saving}>{role ? "Save role" : "Create role"}</Button>}
        </div>
      </form>
    </Modal>
  );
}
