/* Storefront Component: SizeChartInternational */
import SizeChartTable from "./SizeChartTable";

export default function SizeChartInternational({ international }) {
  const columns = ["Size", ...international.columns];
  const rows = international.rows.map((r) => [r.size, r.us, r.uk, r.eu, r.aus, r.tr]);

  return (
    <div className="space-y-4">
      <SizeChartTable columns={columns} rows={rows} caption="International size equivalences" />
      <p className="text-xs leading-relaxed text-espresso/45">
        Sizing is not standardised between markets, so these are the closest equivalents rather
        than exact matches. When in doubt, go by the body measurements.
      </p>
    </div>
  );
}
