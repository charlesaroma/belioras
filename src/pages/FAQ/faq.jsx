/* Page: FAQ - faq */
import PageShell from "../../components/layout/PageShell";

const GROUPS = [
  {
    title: "Orders & shipping",
    items: [
      {
        q: "How long will my order take?",
        a: "We prepare every order within one to four business days. From there it is about 5–14 business days within Germany and the EU, and 7–21 days to our international destinations. Pre-orders take 15–28 business days. We ship with DHL.",
      },
      {
        q: "When is shipping free?",
        a: "Always within Germany. Across the rest of the EU on orders over €250; below that, from €9.99. International orders (United Kingdom, Switzerland, Norway, United States, Canada, Australia and New Zealand) start from €14.99.",
      },
      {
        q: "Will I pay customs or duty?",
        a: "Not within the EU: the price you see includes VAT and nothing further is due. Outside the EU, including the UK and Switzerland, your country may charge import duty or tax on arrival. Those charges are the customer's to pay and are collected by the carrier.",
      },
      {
        q: "Can I track my order?",
        a: "Yes. You will get a tracking link by email at dispatch, and you can look an order up at any time from the order tracking page.",
      },
    ],
  },
  {
    title: "Returns",
    items: [
      {
        q: "How long do I have to return something?",
        a: "Fourteen days from delivery to tell us, and another fourteen to send it back. Pieces need to be unworn with tags attached.",
      },
      {
        q: "Can I return hair?",
        a: "Yes, within 14 days, if it is unopened and still sealed. Once hair has been opened, worn, washed, cut, coloured or styled, or its lace has been cut, we cannot take it back: a hygiene exception EU consumer law allows. If it arrived damaged or was not what you ordered, tell us within 48 hours with photos and we will replace or refund it.",
      },
      {
        q: "Who pays return postage?",
        a: "You do, unless the piece arrived faulty or was not what you ordered — then we cover it.",
      },
      {
        q: "When will I get my money back?",
        a: "Within fourteen days of the return reaching us, to the method you paid with, including the standard outbound shipping.",
      },
    ],
  },
  {
    title: "Sizing & care",
    items: [
      {
        q: "How do your sizes run?",
        a: "True to European sizing. Our size guide lists body measurements rather than garment measurements — if you are between sizes, we suggest the larger, since most of our pieces are cut close.",
      },
      {
        q: "What length of hair should I choose?",
        a: "Our hair length guide shows where each length falls on the body, with the caveat that curly and kinky textures measure shorter when worn than when stretched.",
      },
      {
        q: "How should I care for a piece?",
        a: "Care instructions specific to each piece are on its product page under Care. As a rule, dry clean our tailoring and silk, and wash hair with a sulphate-free shampoo.",
      },
    ],
  },
  {
    title: "Payment",
    items: [
      {
        q: "What can I pay with?",
        a: "Visa, Mastercard, American Express, PayPal, Apple Pay and Klarna. The marks in the footer show what we accept.",
      },
      {
        q: "Is paying here safe?",
        a: "Your card details go straight to our payment provider and never reach our servers. We only ever see the last four digits and whether it succeeded.",
      },
      {
        q: "Can I pay in my own currency?",
        a: "Prices display in euro, pounds or dollars using the switcher in the header. Payment is taken in euro at the rate shown at checkout.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <PageShell
      eyebrow="Client care"
      title="Frequently Asked"
      intro="The questions we are asked most. If yours is not here, write to us and a person will answer."
    >
      <div className="space-y-12">
        {GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-700">
              {group.title}
            </h2>
            <div className="border-t border-umber-50">
              {group.items.map((item) => (
                // <details> so the browser's find-in-page can reach an answer
                // inside a collapsed panel, which a div accordion cannot.
                <details key={item.q} className="group border-b border-umber-50 py-4">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[15px] text-espresso marker:hidden">
                    {item.q}
                    <span
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-espresso/35 transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-espresso-soft">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-12 text-[15px] text-espresso-soft">
        Still stuck?{" "}
        <a
          href="/contact-us"
          className="text-gold-700 underline underline-offset-4 transition-colors hover:text-espresso"
        >
          Write to us
        </a>{" "}
        — we answer within one working day.
      </p>
    </PageShell>
  );
}
