import { formatRange, unitLabel } from "../../../utils/measurements";
import SizeChartTable from "./SizeChartTable";
import SizeChartUnitToggle from "./SizeChartUnitToggle";

/**
 * Body measurements, not garment dimensions.
 *
 * The distinction is the whole point of the table and shoppers get it wrong
 * constantly, so it is stated above the numbers rather than in a footnote
 * nobody reads. The inch column is computed from the stored centimetres, so
 * the two units cannot disagree.
 */
export default function SizeChartBodyTable({ garment, unit, onUnitChange }) {
  const u = unitLabel(unit);
  const columns = ["Size", `Bust (${u})`, `Waist (${u})`, `Hip (${u})`];
  const rows = garment.rows.map((r) => [
    r.size,
    formatRange(r.bust, unit),
    formatRange(r.waist, unit),
    formatRange(r.hip, unit),
  ]);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-espresso">
          Body measurements, not garment dimensions
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-espresso-soft">
          The figures below describe your body. Measure yourself and find the row you fall in —
          the garment is cut with ease already allowed for.
        </p>
      </div>

      <SizeChartUnitToggle unit={unit} onChange={onUnitChange} />

      <SizeChartTable columns={columns} rows={rows} caption="Body measurements by size" />

      <p className="text-xs leading-relaxed text-espresso/45">{garment.note}</p>
    </div>
  );
}
