import PageShell from "../../components/layout/PageShell";

/**
 * Answers drawn from the store's real settings — shipping zones, the €150
 * threshold, the 14-day window, the hair exception — so nothing here can
 * contradict the policy pages it links to.
 */
const GROUPS = [
  {
    title: "Orders & shipping",
    items: [
      {
        q: "How long will my order take?",
        a: "Two to five working days inside the EU, three to seven to the UK, and seven to fourteen elsewhere — counted from dispatch. Orders placed before 13:00 WET on a working day usually leave the same day.",
      },
      {
        q: "When is shipping free?",
        a: "On EU orders over €150. Below that it is €5.90. The UK is €12 and the rest of the world €19, with no free threshold, because both are shipped outside the customs union.",
      },
      {
        q: "Will I pay customs or duty?",
        a: "Not within the EU — the price you see includes 20% VAT and nothing further is due. Outside the EU, including the UK, your country may charge import duty on arrival. That is collected by the carrier and is outside our control.",
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
        a: "Only if the packaging is still sealed. Once a wig or set of extensions is opened we cannot take it back — a hygiene rule, and the one exception EU consumer law makes for goods sealed for health reasons.",
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
