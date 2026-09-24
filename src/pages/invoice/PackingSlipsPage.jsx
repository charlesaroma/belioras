/* Page: Packing Slips */
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2, Printer } from "lucide-react";

import BrandMark from "../../components/shared/BrandMark";
import { useStaffAuth } from "@/context/auth/useAuthRealm";
import { useAsyncData } from "../../hooks/useAsyncData";
import { getAllOrders } from "../../services/sales/ordersApi";
import { getTaxonomy } from "../../services/catalog/navigationApi";
import { sizeLabel } from "../../utils/sizeLabel";

const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

/**
 * One slip per order, one per printed page: who it goes to and what goes in
 * the box, with a tick box for each piece. No prices — a parcel can be a gift.
 * Staff only; opened from the Orders list with the chosen orders.
 */
export default function PackingSlipsPage() {
  const [params] = useSearchParams();
  const ids = (params.get("ids") ?? "").split(",").filter(Boolean);
  const { isAuthenticated } = useStaffAuth();
  const { data: orders, loading } = useAsyncData(getAllOrders, []);
  const { data: taxonomy } = useAsyncData(getTaxonomy, []);

  if (!isAuthenticated) return <Navigate to="/atelier" replace />;
  if (loading) return <div className="flex min-h-dvh items-center justify-center bg-ivory-500"><Loader2 className="size-5 animate-spin text-espresso-soft" aria-label="Loading" /></div>;

  const chosen = ids.map((id) => (orders ?? []).find((o) => o.id === id)).filter(Boolean);

  return (
    <div className="min-h-dvh bg-ivory-500 px-4 py-8 print:bg-white print:p-0">
      <style>{"@media print { @page { size: A4; margin: 0; } }"}</style>
      <div className="mx-auto mb-4 flex max-w-[210mm] items-center justify-between print:hidden">
        <Link to="/dashboard/orders" className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-espresso-soft hover:text-espresso">
          <ArrowLeft className="size-3.5" aria-hidden="true" /> Back to orders
        </Link>
        <button type="button" onClick={() => window.print()} className="btn btn-md btn-primary bg-espresso text-ivory-50 hover:bg-espresso-600">
          <Printer className="size-4" aria-hidden="true" /> Print {chosen.length} {chosen.length === 1 ? "slip" : "slips"}
        </button>
      </div>

      {chosen.length === 0 && <p className="text-center text-sm text-espresso-soft">No orders chosen. Select orders on the Orders page first.</p>}

      <div className="space-y-6 print:space-y-0">
        {chosen.map((o) => (
          <article key={o.id} className="mx-auto max-w-[210mm] break-after-page bg-white p-8 text-[13px] text-espresso shadow-medium sm:p-12 print:max-w-none print:p-[16mm] print:shadow-none">
            <header data-print className="flex items-start justify-between gap-6 border-b border-umber-100 pb-6">
              <BrandMark label="Belioras" />
              <div className="text-right">
                <h1 className="font-display text-3xl tracking-wide">Packing slip</h1>
                <p className="mt-2 text-[12px] text-espresso-soft">Order <strong className="font-medium text-espresso">{o.id}</strong> · {date.format(new Date(o.createdAt))}</p>
              </div>
            </header>

            <section className="py-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-espresso-soft">Ship to</p>
              <p className="mt-2 text-[15px] leading-relaxed">
                {o.name ?? "Customer"}
                <br />
                {o.shippingAddress ?? "No address on the order"}
              </p>
            </section>

            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-umber-100 text-[10px] uppercase tracking-[0.16em] text-espresso-soft">
                  <th className="w-10 py-2 font-semibold"><span className="sr-only">Packed</span></th>
                  <th className="py-2 pr-4 font-semibold">Piece</th>
                  <th className="py-2 pr-4 font-semibold">Colour</th>
                  <th className="py-2 pr-4 font-semibold">Size</th>
                  <th className="py-2 text-right font-semibold">Qty</th>
                </tr>
              </thead>
              <tbody>
                {(o.items ?? []).map((i, n) => (
                  <tr key={`${i.productId}-${n}`} className="border-b border-umber-50">
                    <td className="py-3"><span aria-hidden="true" className="block size-4 border border-espresso/40" /></td>
                    <td className="py-3 pr-4">{i.name}</td>
                    <td className="py-3 pr-4 text-espresso-soft">{i.color ?? "—"}</td>
                    <td className="py-3 pr-4 text-espresso-soft">{i.size ? (i.size === "one-size" ? "One size" : sizeLabel(taxonomy, i.size)) : "—"}</td>
                    <td className="py-3 text-right tabular-nums">{i.quantity ?? 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <footer data-print className="mt-10 border-t border-umber-100 pt-5 text-[11px] leading-relaxed text-espresso-soft">
              Thank you for choosing Belioras. Unworn pieces can be returned within 14 days; hair, once opened, cannot, for hygiene reasons.
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
