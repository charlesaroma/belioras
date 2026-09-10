import { formatInches, unitLabel } from "../../../utils/measurements";
import SizeChartTable from "./SizeChartTable";
import SizeChartUnitToggle from "./SizeChartUnitToggle";

/** Where each length falls, on a 168 cm frame. */
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

/**
 * How texture changes worn length.
 *
 * A 20-inch curly wig does not wear at 20 inches, and this is the single most
 * common reason a hair order disappoints. The table is the guide's real
 * content, not a footnote to the lengths above.
 */
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
