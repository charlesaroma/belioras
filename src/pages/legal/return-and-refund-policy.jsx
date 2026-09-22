/* Page: Legal - return-and-refund-policy */
import PageShell, { Section } from "../../components/layout/PageShell";
import { BUSINESS, UPDATED } from "./legalDetails";
import LegalFacts from "./sections/LegalFacts";

const mail = <a href={`mailto:${BUSINESS.support}`}>{BUSINESS.support}</a>;

export default function ReturnAndRefundPolicyPage() {
  return (
    <PageShell
      eyebrow="Store policies"
      title="Returns &amp; Refunds"
      intro="Our commitment to quality, transparent service and your satisfaction: fourteen days to change your mind, and why opened hair can't come back."
      meta={UPDATED}
    >
      <LegalFacts
        facts={[
          { label: "Change of mind", value: "14 days", note: "From delivery" },
          { label: "Condition", value: "Unused", note: "Tags on, original packaging" },
          { label: "Hair", value: "Unopened only", note: "Hygiene seal intact" },
          { label: "Refund", value: "Within 14 days", note: "To the original method" },
        ]}
      />

      <Section title="Your right to withdraw">
        <p>
          You may withdraw from your purchase within <strong>14 days</strong> of receiving it, for any
          reason. Pieces must come back unused and unworn, with their tags, in their original
          packaging. The full rules and a withdrawal form are in our{" "}
          <a href="/terms-of-service">Terms &amp; Conditions</a>.
        </p>
      </Section>

      <Section title="Hair: our hygiene policy">
        <p>Because of the nature of hair products, we keep a strict hygiene policy. We cannot accept hair back if:</p>
        <ul>
          <li>it has been worn or installed</li>
          <li>the lace has been cut</li>
          <li>it has been washed, brushed, coloured, bleached or styled</li>
          <li>its tags or hygiene seal have been removed</li>
          <li>it is no longer in its original condition</li>
        </ul>
        <p>Unopened hair, with its seal intact, can be returned within the 14 days like any other piece.</p>
      </Section>

      <Section title="Other pieces we can't take back">
        <ul>
          <li>Opened cosmetics and beauty products</li>
          <li>Lingerie, swimwear and bodysuits once the hygiene seal is removed</li>
          <li>Personalised or made-to-order pieces</li>
        </ul>
      </Section>

      <Section title="Damaged or wrong item">
        <p>
          If a piece arrives damaged, or is not what you ordered, please tell us within 48 hours with
          photos at {mail}. We will replace or refund it at no cost to you. Your statutory warranty
          rights, including the two years EU law gives you for faulty goods, are not affected.
        </p>
      </Section>

      <Section title="How to return something">
        <ul>
          <li>Email {mail} with your order number and the pieces you are returning.</li>
          <li>Send them back within 14 days of telling us.</li>
          <li>Return shipping is at your cost, unless the piece was faulty or wrong.</li>
        </ul>
        <p>We don&rsquo;t offer direct exchanges: return the piece and place a new order.</p>
      </Section>

      <Section title="Your refund">
        <p>
          We refund within 14 days, to the payment method you used, including the standard delivery
          cost of your original order. We may wait until the piece is back with us, or until you show
          us you have sent it.
        </p>
      </Section>

      <Section title="Before you install hair">
        <p>Please inspect your hair thoroughly before installation. We are not responsible for:</p>
        <ul>
          <li>improper installation, or lace torn during fitting</li>
          <li>damage from bleaching, colouring or extreme heat</li>
          <li>shedding caused by cutting wefts or home styling</li>
        </ul>
        <p>
          Slight variations in colour and curl pattern, and minimal natural shedding, are normal for
          authentic raw and virgin hair.
        </p>
      </Section>
    </PageShell>
  );
}
