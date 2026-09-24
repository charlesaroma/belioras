/* Admin Dashboard Page: Overview - OverviewTopSellers */
import { Link } from "react-router-dom";

/** The pieces that sold most in the latest month, with units and what they brought in. */
export default function OverviewTopSellers({ topSellers, format, loading, seesMoney = true }) {
  const rows = topSellers?.rows ?? [];

  return (
    <section className="border border-umber-50 bg-ivory-50 p-6" aria-labelledby="sellers-heading">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="sellers-heading" className="font-display text-2xl text-espresso">Top sellers</h2>
        {topSellers?.scope && (
          <span className="text-[11px] uppercase tracking-[0.16em] text-espresso-soft">{topSellers.scope}</span>
        )}
      </div>

      {loading ? (
        <p className="mt-4 text-[13px] text-espresso-soft">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="mt-4 text-[13px] text-espresso-soft">Sales will appear here once orders come in.</p>
      ) : (
        <ol className="mt-4 divide-y divide-umber-50">
          {rows.map((row) => (
            <li key={row.id} className="flex items-center gap-3 py-2.5">
              <img src={row.image} alt="" className="size-11 shrink-0 border border-umber-50 object-cover" />
              <Link to={`/dashboard/products/${row.id}/edit`} className="min-w-0 flex-1 truncate text-[13px] text-espresso transition-colors hover:text-gold-700">
                {row.name}
              </Link>
              <span className="shrink-0 text-right text-[12px] tabular-nums text-espresso-soft">
                {row.units} sold
                {seesMoney && <span className="block text-[11px] text-espresso/45">{format(row.revenue)}</span>}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
