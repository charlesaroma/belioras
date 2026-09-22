/* Admin Dashboard: DashFilterChips */
import { X } from "lucide-react";

/** The filters that are on, each removable, plus "Clear all". Renders nothing when none are. */
export default function DashFilterChips({ groups, value, onChange }) {
  const chips = groups.flatMap((group) =>
    (value[group.id] ?? []).map((v) => ({
      group,
      value: v,
      label: group.options.find((o) => o.value === v)?.label ?? v,
    })),
  );
  if (!chips.length) return null;

  const remove = (chip) =>
    onChange((latest) => ({ ...latest, [chip.group.id]: (latest[chip.group.id] ?? []).filter((v) => v !== chip.value) }));

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((chip) => (
        <button
          key={`${chip.group.id}:${chip.value}`}
          type="button"
          onClick={() => remove(chip)}
          aria-label={`Remove filter ${chip.group.label}: ${chip.label}`}
          className="flex min-h-8 items-center gap-1.5 border border-umber-100 bg-ivory-50 px-2.5 text-[12px] text-espresso transition-colors hover:border-espresso"
        >
          <span className="text-espresso-soft">{chip.group.label}:</span>
          {chip.label}
          <X className="size-3" aria-hidden="true" />
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange({})}
        className="min-h-8 px-2 text-[11px] uppercase tracking-[0.14em] text-gold-700 transition-colors hover:text-espresso"
      >
        Clear all
      </button>
    </div>
  );
}
