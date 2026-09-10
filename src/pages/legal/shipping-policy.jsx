/* Page: Legal - shipping-policy */
import PageShell, { Section } from "../../components/layout/PageShell";

const ZONES = [
  { zone: "European Union", cost: "€5.90", free: "Free over €150", time: "2–5 working days" },
  { zone: "United Kingdom", cost: "€12.00", free: "—", time: "3–7 working days" },
  { zone: "Rest of World", cost: "€19.00", free: "—", time: "7–14 working days" },
];

export default function ShippingPolicyPage() {
  return (
    <PageShell
      eyebrow="Client care"
      title="Shipping &amp; Delivery"
      intro="Where we ship, what it costs, and how long it takes. Every order is tracked and insured."
      meta="Last updated 8 September 2026"
    >
      <Section title="Rates and timings">
        <div className="-mx-1 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-umber-50 text-[10px] uppercase tracking-[0.16em] text-espresso/45">
                <th className="pb-2 pr-4 font-semibold">Destination</th>
                <th className="pb-2 pr-4 font-semibold">Shipping</th>
                <th className="pb-2 pr-4 font-semibold">Free over</th>
                <th className="pb-2 font-semibold">Estimated</th>
              </tr>
            </thead>
            <tbody>
              {ZONES.map((z) => (
                <tr key={z.zone} className="border-b border-umber-50/60 last:border-0">
                  <td className="py-3 pr-4 text-espresso">{z.zone}</td>
                  <td className="py-3 pr-4 tabular-nums">{z.cost}</td>
                  <td className="py-3 pr-4">{z.free}</td>
                  <td className="py-3">{z.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Times run from dispatch, not from when you order. Orders placed before 13:00 WET on a
          working day are usually dispatched the same day.
        </p>
      </Section>

      <Section title="Duties and taxes">
        <p>
          Prices include 20% VAT. For orders inside the EU, that is everything you pay — nothing
          further is due on delivery.
        </p>
        <p>
          <strong>Outside the EU</strong>, including the United Kingdom, your order may attract
          import duty or local tax on arrival. That is set by your country, collected by the carrier,
          and is not something we can calculate or refund.
        </p>
      </Section>

      <Section title="Tracking your order">
        <p>
          You will receive a tracking link by email at dispatch. You can also follow an order from{" "}
          <a href="/order-tracking">order tracking</a>, or in your account if you have one.
        </p>
      </Section>

      <Section title="Pre-order pieces">
        <p>
          Where a piece is available to pre-order, the expected dispatch date is stated in its
          description. An order containing a pre-order item ships complete, once every piece in it is
          ready — tell us if you would prefer it split and we will arrange it.
        </p>
      </Section>

      <Section title="If something goes wrong">
        <p>
          Every parcel is insured. If yours arrives damaged, or tracking has not moved for five
          working days, write to <a href="mailto:support@belioras.com">support@belioras.com</a> and we will
          replace it or refund you.
        </p>
      </Section>
    </PageShell>
  );
}
