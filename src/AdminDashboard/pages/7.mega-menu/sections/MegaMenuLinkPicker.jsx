/* Admin Dashboard Page: Mega-menu - MegaMenuLinkPicker */
import { useState } from "react";

import Modal from "@/components/common/Modal";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Toggle from "@/AdminDashboard/components/Toggle";
import { cn } from "@/utils/cn";
import { targetExists } from "@/utils/menuTargets";
import { describeTarget, suggestLabel } from "@/utils/menuTargetText";
import MegaMenuOptionList from "./MegaMenuOptionList";
import { MULTI, SCOPED, countFor, kindsFor, optionsFor, piecesText, stateFrom, targetFrom } from "./megaMenuPickerOptions";

const TITLES = { item: ["New menu item", "What this menu item shows"], link: ["Add a link", "Change this link"] };

/**
 * Chooses what a menu item or link shows, from what already exists. Nothing is
 * typed but the name, and the name is suggested. Remount with a changing `key`.
 */
export default function MegaMenuLinkPicker({ open, mode = "link", initial = null, defaultCategory = "", lookups, addressFor, onClose, onSave }) {
  const kinds = kindsFor(mode);
  const [state, setState] = useState(() => {
    const s = stateFrom(initial?.target, defaultCategory);
    return { ...s, kind: kinds.some((k) => k.id === s.kind) ? s.kind : kinds[0].id };
  });
  const [label, setLabel] = useState(initial?.label ?? "");
  const [touched, setTouched] = useState(Boolean(initial?.label));

  const target = targetFrom(state);
  const name = touched ? label : target ? suggestLabel(target, lookups) : "";
  const valid = Boolean(target && targetExists(target, lookups) && name.trim());
  const multi = MULTI.has(state.kind);
  const scoped = mode === "link" && SCOPED.has(state.kind);
  const canNewOnly = mode === "link" && !(state.kind === "label" && state.values[0] === "new");
  const total = countFor(target, lookups.products);

  const setKind = (kind) => setState((s) => ({ ...s, kind, values: kind === "all" ? ["all"] : [] }));
  const pick = (value) =>
    setState((s) => ({
      ...s,
      values: multi ? (s.values.includes(value) ? s.values.filter((v) => v !== value) : [...s.values, value]) : [value],
    }));
  const countOf = (value) => countFor(targetFrom({ ...state, values: [value] }), lookups.products);

  return (
    <Modal open={open} onClose={onClose} title={TITLES[mode][initial ? 1 : 0]} width="max-w-2xl">
      <div className="space-y-5">
        <div>
          <p className="input-label">What should it show?</p>
          <div role="radiogroup" aria-label="What it shows" className="flex flex-wrap gap-1.5">
            {kinds.map((k) => (
              <button
                key={k.id}
                type="button"
                role="radio"
                aria-checked={state.kind === k.id}
                onClick={() => setKind(k.id)}
                className={cn(
                  "min-h-9 border px-3 text-[12px] transition-colors",
                  state.kind === k.id
                    ? "border-espresso bg-espresso text-ivory-50"
                    : "border-umber-100 bg-ivory-50 text-espresso-soft hover:border-espresso/50 hover:text-espresso",
                )}
              >
                {k.label}
              </button>
            ))}
          </div>
        </div>

        {state.kind !== "all" && (
          <div>
            <p className="input-label">{multi ? "Choose one or more" : "Choose one"}</p>
            <MegaMenuOptionList options={optionsFor(state.kind, lookups)} selected={state.values} multi={multi} countOf={countOf} onPick={pick} />
          </div>
        )}

        {(scoped || canNewOnly) && (
          <div className="grid items-end gap-4 sm:grid-cols-2">
            {scoped && (
              <Field label="Only in">
                <select value={state.category} onChange={(e) => setState((s) => ({ ...s, category: e.target.value }))}>
                  <option value="">Any category</option>
                  {lookups.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
            )}
            {canNewOnly && (
              <div className="pb-2">
                <Toggle checked={state.newOnly} onChange={(on) => setState((s) => ({ ...s, newOnly: on }))} label="Only new arrivals" />
              </div>
            )}
          </div>
        )}

        <Field label="Name shoppers see" required>
          <input
            value={name}
            placeholder="Choose what it shows first"
            onChange={(e) => {
              setLabel(e.target.value);
              setTouched(true);
            }}
          />
        </Field>

        <p className="border-t border-umber-50 pt-4 text-[12px] leading-relaxed text-espresso-soft">
          {target ? (
            <>
              Shows <span className="text-espresso">{describeTarget(target, lookups)}</span> · {piecesText(total).toLowerCase()}
            </>
          ) : (
            "Nothing chosen yet."
          )}
          {addressFor && name.trim() && (
            <>
              {" "}· Address <code className="text-espresso">{addressFor(name.trim())}</code>
            </>
          )}
        </p>

        {/* Pinned to the foot of the dialog's scroll area, so the action is never below the fold. */}
        <div className="surface-header sticky bottom-0 -mx-6 -mb-5 flex justify-end gap-2 border-t border-umber-50 px-6 py-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!valid} onClick={() => onSave({ label: name.trim(), target })} className="bg-espresso text-ivory-50 hover:bg-espresso-600">
            {initial ? "Save" : mode === "item" ? "Add to menu" : "Add link"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
