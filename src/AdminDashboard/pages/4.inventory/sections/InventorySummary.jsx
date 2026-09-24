/* Admin Dashboard Page: Inventory - InventorySummary */
import { AlertTriangle, Banknote, Boxes, CircleSlash, Clock } from "lucide-react";

import StatCard from "@/AdminDashboard/components/StatCard";

/** Stock across the whole shop, whatever the list below is filtered to. */
export default function InventorySummary({ summary, format, loading }) {
  const n = (v) => (loading ? "—" : v.toLocaleString());
  return (
    <div className="grid shrink-0 gap-px bg-umber-50 grid-cols-2 xl:grid-cols-5">
      <StatCard label="On hand" value={n(summary.onHand)} hint="units on the shelf" icon={Boxes} />
      <StatCard label="In open orders" value={n(summary.reserved)} hint="held until they ship" icon={Clock} />
      <StatCard label="Stock value" value={loading ? "—" : format(summary.value)} hint={summary.cost > 0 ? `at retail · ${format(summary.cost)} at cost` : "at retail price"} icon={Banknote} />
      <StatCard label="Low stock" value={n(summary.low)} hint="variants to reorder" icon={AlertTriangle} />
      <StatCard label="Sold out" value={n(summary.out)} hint="variants with none to sell" icon={CircleSlash} />
    </div>
  );
}
