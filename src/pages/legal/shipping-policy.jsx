/* Page: Legal - shipping-policy */
import PageShell, { Section } from "../../components/layout/PageShell";
import { SHIPPING_COUNTRIES } from "../../utils/checkout";
import { BUSINESS, SHIPPING_ZONES, UPDATED } from "./legalDetails";

export default function ShippingPolicyPage() {
  return (
    <PageShell
      eyebrow="Worldwide delivery"
      title="Shipping &amp; Delivery"
      intro="Every order is prepared, packed and dispatched from our atelier. Here's what to expect, wherever you are."
      meta={UPDATED}
    >
      <Section title="Rates and timings">
        <div className="-mx-1 overflow-x-auto">
          <table className="w-full min-w-[460px] text-left text-sm">
            <thead>
              <tr className="border-b border-umber-50 text-[10px] uppercase tracking-[0.16em] text-espresso/45">
                <th className="pb-2 pr-4 font-semibold">Destination</th>
                <th className="pb-2 pr-4 font-semibold">Shipping</th>
                <th className="pb-2 pr-4 font-semibold">Free</th>
                <th className="pb-2 font-semibold">Delivery</th>
              </tr>
            </thead>
            <tbody>
              {SHIPPING_ZONES.map((z) => (
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
          EU shipping is free on orders over €250; below that, rates start from €9.99. International
          rates start from €14.99. The exact cost is shown at checkout.
        </p>
      </Section>

      <Section title="Where we ship">
        <p>
          <strong>Germany</strong> and the <strong>European Union</strong> ({SHIPPING_COUNTRIES.eu.length} more
          countries): {SHIPPING_COUNTRIES.eu.join(", ")}.
        </p>
        <p>
          <strong>International</strong> ({SHIPPING_COUNTRIES.intl.length} destinations):{" "}
          {SHIPPING_COUNTRIES.intl.join(", ")}.
        </p>
        <p>Don&rsquo;t see your country, or it is missing at checkout? We don&rsquo;t ship there yet, but our network is growing.</p>
      </Section>

      <Section title="Processing">
        <p>
          Orders are prepared within 1–4 business days before they leave the atelier. Pre-orders need
          more time; see the delivery estimate above. Delivery times are estimates and can run longer
          because of customs, weather or the carrier.
        </p>
      </Section>

      <Section title="Carrier and tracking">
        <p>
          Orders travel mainly with DHL. Where it serves the delivery better, we use another trusted
          courier. Once your order ships you will get an email with its tracking link, and you can
          also follow it from <a href="/order-tracking">order tracking</a>.
        </p>
      </Section>

      <Section title="Duties and taxes">
        <p>Prices include VAT. Within the EU, nothing further is due on delivery.</p>
        <p>
          <strong>Outside the EU</strong>, including the United Kingdom and Switzerland, your order may
          be charged import duty or tax on arrival. These charges are set by your country, collected
          by the carrier, and are the customer&rsquo;s to pay.
        </p>
      </Section>

      <Section title="Lost or damaged parcels">
        <p>
          If your parcel arrives damaged, or its tracking hasn&rsquo;t moved for five working days,
          write to <a href={`mailto:${BUSINESS.support}`}>{BUSINESS.support}</a> and we will sort it
          out. If tracking says delivered but the parcel hasn&rsquo;t reached you, tell us straight
          away and we will investigate it with the carrier.
        </p>
      </Section>
    </PageShell>
  );
}
