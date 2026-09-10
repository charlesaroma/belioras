import { formatMeasurement, unitLabel } from "../../../utils/measurements";
import SizeChartTable from "./SizeChartTable";
import SizeChartUnitToggle from "./SizeChartUnitToggle";

/**
 * Footwear conversions, on the EU scale.
 *
 * Shoes used to open the garment table, so someone choosing EU 38 pumps was
 * shown bust, waist and hip measurements — a chart with no bearing on the
 * decision in front of them.
 */
export default function SizeChartShoeTable({ footwear, unit, onUnitChange }) {
  const columns = ["EU", "UK", "US", `Foot length (${unitLabel(unit)})`];
  const rows = footwear.rows.map((r) => [r.eu, r.uk, r.us, formatMeasurement(r.cm, unit, { decimals: 1 })]);

  return (
    <div className="space-y-4">
      <SizeChartUnitToggle unit={unit} onChange={onUnitChange} />
      <SizeChartTable columns={columns} rows={rows} caption="Footwear size conversions" />
      <p className="text-xs leading-relaxed text-espresso/45">{footwear.note}</p>
    </div>
  );
}
