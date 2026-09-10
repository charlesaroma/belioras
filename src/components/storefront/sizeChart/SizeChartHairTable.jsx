/* Storefront Component: SizeChartHairTable */
import { formatInches, unitLabel } from "../../../utils/measurements";
import SizeChartTable from "./SizeChartTable";
import SizeChartUnitToggle from "./SizeChartUnitToggle";

export function SizeChartHairLengths({ hair, unit, onUnitChange }) {
  const columns = [`Length (${unitLabel(unit)})`, "Falls at", "Note"];
  const rows = hair.lengths.map((r) => [formatInches(r.in, unit), r.falls, r.note || "—"]);

  return (
    <div className="space-y-4">
      <SizeChartUnitToggle unit={unit} onChange={onUnitChange} />
      <SizeChartTable columns={columns} rows={rows} caption="Hair lengths and where they fall" />
      <p className="text-xs leading-relaxed text-espresso/45">{hair.note}</p>
    </div>
  );
}

export function SizeChartHairTextures({ hair }) {
  const rows = hair.textures.map((t) => [t.name, t.note]);

  return (
    <div className="space-y-4">
      <p className="text-[13px] leading-relaxed text-espresso-soft">
        Length is measured straight, before any curl pattern. The tighter the texture, the
        shorter it wears — size up if a particular length matters to you.
      </p>
      <SizeChartTable
        columns={["Texture", "How it wears"]}
        rows={rows}
        caption="How texture changes worn length"
      />
    </div>
  );
}
