/* Page: Invoice */
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Printer } from "lucide-react";

import BrandMark from "../../components/shared/BrandMark";
import { useCustomerAuth, useStaffAuth } from "@/context/auth/useAuthRealm";
import { useAsyncData } from "../../hooks/useAsyncData";
import { getInvoice } from "../../services/sales/ordersApi";

const eur = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

/**
 * One order's invoice, laid out for A4. The same page serves the customer
 * (from their order) and staff (from the dashboard); "Print or save as PDF"
 * uses the browser's own print, and everything but the invoice is hidden
 * when printing. Always in euros: an invoice is a tax document in the
 * shop's currency, whatever the shopper browsed in.
 */
export default function InvoicePage() {
  const { id } = useParams();
  const staff = useStaffAuth();
  const customer = useCustomerAuth();
  const as = useMemo(
    () => (staff.isAuthenticated ? { staff: true } : { userId: customer.user?.id, email: customer.user?.email }),
    [staff.isAuthenticated, customer.user?.id, customer.user?.email],
  );
  const { data, loading, error } = useAsyncData(() => getInvoice(id, as), [id, as]);
  const back = staff.isAuthenticated ? `/dashboard/orders?order=${id}` : `/account/orders/${id}`;

  if (loading) {
    return <div className="flex min-h-dvh items-center justify-center bg-ivory-500"><Loader2 className="size-5 animate-spin text-espresso-soft" aria-label="Loading" /></div>;
  }
  if (error || !data) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-ivory-500 px-6 text-center">
        <p className="font-display text-2xl text-espresso">No invoice to show</p>
        <p className="max-w-md text-sm text-espresso-soft">{error?.message ?? "This invoice could not be found."}</p>
        <Link to={back} className="text-[11px] uppercase tracking-[0.18em] text-gold-800 underline underline-offset-4">Back to the order</Link>
      </div>
    );
  }

  const { order, seller, lines, totals, rate } = data;
  const pct = `${Math.round(rate * 1000) / 10}%`;

  return (
    <div className="min-h-dvh bg-ivory-500 px-4 py-8 print:bg-white print:p-0">
      {/* A4, and no margin for the browser to print its date, title and address into. */}
      <style>{"@media print { @page { size: A4; margin: 0; } }"}</style>
      <div className="mx-auto mb-4 flex max-w-[210mm] items-center justify-between print:hidden">
        <Link to={back} className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-espresso-soft hover:text-espresso">
          <ArrowLeft className="size-3.5" aria-hidden="true" /> Back to the order
        </Link>
        <button type="button" onClick={() => window.print()} className="btn btn-md btn-primary bg-espresso text-ivory-50 hover:bg-espresso-600">
          <Printer className="size-4" aria-hidden="true" /> Print or save as PDF
        </button>
      </div>

      <article className="mx-auto max-w-[210mm] bg-white p-8 text-[13px] text-espresso shadow-medium sm:p-12 print:max-w-none print:p-[16mm] print:shadow-none">
        <header data-print className="flex flex-wrap items-start justify-between gap-6 border-b border-umber-100 pb-8">
          <div>
            <BrandMark label="Belioras" />
            <p className="mt-4 max-w-[16rem] text-[12px] leading-relaxed text-espresso-soft">
              {seller.name}
              <br />
              {seller.address}
              {seller.email && <><br />{seller.email}</>}
            </p>
          </div>
          <div className="text-right">
            <h1 className="font-display text-3xl tracking-wide">Invoice</h1>
            <dl className="mt-3 space-y-0.5 text-[12px]">
              <div><dt className="inline text-espresso-soft">Invoice no. </dt><dd className="inline font-medium tabular-nums">{order.invoiceNumber}</dd></div>
              <div><dt className="inline text-espresso-soft">Date of issue </dt><dd className="inline">{date.format(new Date(order.paidAt ?? order.createdAt))}</dd></div>
              <div><dt className="inline text-espresso-soft">Delivery date </dt><dd className="inline">{date.format(new Date(order.createdAt))}</dd></div>
              <div><dt className="inline text-espresso-soft">Order </dt><dd className="inline tabular-nums">{order.id}</dd></div>
            </dl>
          </div>
        </header>

        <section className="grid gap-6 py-8 sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-espresso-soft">Billed to</p>
            <p className="mt-2 leading-relaxed">
              {order.name ?? "Customer"}
              <br />
              {order.shippingAddress}
              <br />
              <span className="text-espresso-soft">{order.email}</span>
            </p>
          </div>
          {order.status === "refunded" && (
            <p className="self-start border border-error/30 bg-error/5 px-4 py-3 text-[12px] text-error">
              This order was refunded in full. A credit note cancels this invoice.
            </p>
          )}
        </section>

        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-umber-100 text-[10px] uppercase tracking-[0.16em] text-espresso-soft">
              <th className="py-2 pr-4 font-semibold">Item</th>
              <th className="py-2 pr-4 text-right font-semibold">Qty</th>
              <th className="py-2 pr-4 text-right font-semibold">Unit price</th>
              <th className="py-2 pr-4 text-right font-semibold">Net</th>
              <th className="py-2 text-right font-semibold">Total incl. VAT</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, i) => (
              <tr key={`${line.name}-${i}`} className="border-b border-umber-50 align-top">
                <td className="py-3 pr-4">
                  {line.name}
                  {(line.size || line.color) && (
                    <span className="block text-[11px] text-espresso-soft">{[line.color, line.size && `Size ${String(line.size).toUpperCase()}`].filter(Boolean).join(" · ")}</span>
                  )}
                </td>
                <td className="py-3 pr-4 text-right tabular-nums">{line.quantity ?? 1}</td>
                <td className="py-3 pr-4 text-right tabular-nums">{eur.format(line.price ?? 0)}</td>
                <td className="py-3 pr-4 text-right tabular-nums">{eur.format(line.net)}</td>
                <td className="py-3 text-right tabular-nums">{eur.format(line.gross)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <dl className="ml-auto mt-6 w-full max-w-xs space-y-1.5 text-[13px]">
          <div className="flex justify-between"><dt className="text-espresso-soft">Net amount</dt><dd className="tabular-nums">{eur.format(totals.net)}</dd></div>
          <div className="flex justify-between"><dt className="text-espresso-soft">VAT {pct}</dt><dd className="tabular-nums">{eur.format(totals.vat)}</dd></div>
          <div className="flex justify-between border-t border-umber-100 pt-2 text-[15px] font-semibold"><dt>Total paid</dt><dd className="tabular-nums">{eur.format(totals.gross)}</dd></div>
        </dl>

        <footer data-print className="mt-12 space-y-2 border-t border-umber-100 pt-6 text-[11px] leading-relaxed text-espresso-soft">
          {seller.note && <p>{seller.note}</p>}
          <p>
            {seller.vatId ? `VAT ID ${seller.vatId}` : "VAT ID: not yet set in Settings"}
            {seller.taxNumber && ` · Tax number ${seller.taxNumber}`}
          </p>
        </footer>
      </article>
    </div>
  );
}
