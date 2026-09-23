/* Admin Dashboard Page: Shipping - ShippingZonesPanel */
import Field from "../../../../components/ui/Field";
import Panel from "@/AdminDashboard/components/Panel";

export default function ShippingZonesPanel({ zones, onChange }) {

  // Built against the already-resolved `zones` prop, not a functional state
  // updater — the parent's own state starts `null` until the first edit, and
  // a functional updater would receive that `null` rather than the seeded
  // default, breaking the very first change.
  const patch = (index, changes) =>
    onChange(zones.map((z, i) => (i === index ? { ...z, ...changes } : z)));

  return (
    <Panel
      title="Shipping zones"
      hint="Flat rate per zone, with an optional threshold above which shipping is complimentary."
    >
      <div className="space-y-4">
        {zones.map((zone, i) => (
          <div key={zone.id} className="border border-umber-50 p-4">
            <p className="mb-3 text-[13px] font-medium text-espresso">{zone.label}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Flat rate (EUR)">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={zone.flat ?? 0}
                  onChange={(e) => patch(i, { flat: Number(e.target.value) })}
                />
              </Field>
              <Field label="Free above (EUR)" helper="Blank for none.">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={zone.freeThreshold ?? ""}
                  onChange={(e) =>
                    patch(i, {
                      freeThreshold: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
              </Field>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
