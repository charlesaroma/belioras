/* Admin Dashboard Page: Team - RolesPanel */
import { Lock, Pencil, Trash2, Users } from "lucide-react";

import IconAction from "@/AdminDashboard/components/IconAction";
import { SECTIONS, levelIn } from "@/utils/permissions";

/** One card per role: what it is for, who holds it, and a strip of its sections by level. */
export default function RolesPanel({ roles, canManage, onEdit, onDelete }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {roles.map((role) => {
        const byLevel = (level) => SECTIONS.filter((s) => levelIn(role, s.id) === level);
        const edit = byLevel("edit");
        const view = byLevel("view");
        return (
          <article key={role.id} className="flex flex-col border border-umber-50 bg-ivory-50 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="flex items-center gap-2 font-display text-xl text-espresso">
                  {role.name}
                  {role.locked && <Lock className="size-3.5 text-gold-700" aria-label="Locked" />}
                </h3>
                <p className="mt-1 text-[12px] leading-relaxed text-espresso-soft">{role.description}</p>
              </div>
              <div className="flex shrink-0">
                <IconAction label={role.locked ? `See ${role.name}` : `Edit ${role.name}`} icon={Pencil} onClick={() => onEdit(role)} />
                {canManage && !role.locked && <IconAction label={`Delete ${role.name}`} icon={Trash2} destructive onClick={() => onDelete(role)} />}
              </div>
            </div>

            <div className="mt-4 flex-1 space-y-2 text-[11px]">
              {role.locked ? (
                <p className="text-espresso">Every section, to change.</p>
              ) : (
                <>
                  {edit.length > 0 && (
                    <p className="flex flex-wrap gap-1">
                      <span className="mr-1 w-12 shrink-0 pt-0.5 font-semibold uppercase tracking-[0.12em] text-espresso">Edit</span>
                      {edit.map((s) => <span key={s.id} className="bg-espresso px-1.5 py-0.5 text-ivory-50">{s.label}</span>)}
                    </p>
                  )}
                  {view.length > 0 && (
                    <p className="flex flex-wrap gap-1">
                      <span className="mr-1 w-12 shrink-0 pt-0.5 font-semibold uppercase tracking-[0.12em] text-espresso-soft">View</span>
                      {view.map((s) => <span key={s.id} className="bg-gold-500/20 px-1.5 py-0.5 text-gold-900">{s.label}</span>)}
                    </p>
                  )}
                </>
              )}
            </div>

            <p className="mt-4 flex items-center gap-1.5 border-t border-umber-50 pt-3 text-[12px] text-espresso-soft">
              <Users className="size-3.5" aria-hidden="true" />
              {role.members} {role.members === 1 ? "person" : "people"}
            </p>
          </article>
        );
      })}
    </div>
  );
}
