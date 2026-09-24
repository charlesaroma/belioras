/* Admin Dashboard Page: Overview - OverviewAttention */
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const ITEMS = [
  { key: "toShip", one: "order paid and ready to ship", many: "orders paid and ready to ship", to: "/dashboard/orders?status=to-ship" },
  { key: "pendingReviews", one: "review waiting for approval", many: "reviews waiting for approval", to: "/dashboard/reviews?status=pending" },
];

/** What is waiting on someone, each row a link straight to the work. */
export default function OverviewAttention({ attention, loading }) {
  const open = ITEMS.filter((i) => (attention?.[i.key] ?? 0) > 0);

  return (
    <section className="border border-umber-50 bg-ivory-50 p-6" aria-labelledby="attention-heading">
      <h2 id="attention-heading" className="font-display text-2xl text-espresso">Needs attention</h2>
      {loading ? (
        <p className="mt-4 text-[13px] text-espresso-soft">Loading…</p>
      ) : open.length === 0 ? (
        <p className="mt-4 flex items-center gap-2 text-[13px] text-espresso-soft">
          <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
          Nothing is waiting on you.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-umber-50">
          {open.map((item) => {
            const n = attention[item.key];
            return (
              <li key={item.key}>
                <Link to={item.to} className="group flex items-center gap-4 py-3 transition-colors hover:text-gold-700">
                  <span className="w-8 font-display text-2xl tabular-nums text-espresso group-hover:text-gold-700">{n}</span>
                  <span className="flex-1 text-[13px] text-espresso-soft">{n === 1 ? item.one : item.many}</span>
                  <ArrowRight className="size-4 text-espresso/30 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
