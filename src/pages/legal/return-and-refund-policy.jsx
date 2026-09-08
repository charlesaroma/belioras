import PageShell, { Section } from "../../components/layout/PageShell";

export default function ReturnAndRefundPolicyPage() {
  return (
    <PageShell
      eyebrow="Client care"
      title="Returns &amp; Refunds"
      intro="Fourteen days to change your mind on unworn pieces, and what happens with hair, which we cannot take back."
      meta="Last updated 8 September 2026"
    >
      <Section title="Your right to withdraw">
        <p>
          Under EU consumer law you may cancel within <strong>14 days</strong> of receiving your
          order, for any reason, and you have a further 14 days to send it back. We ask only that
          pieces come back unworn, with their tags attached and in their original packaging.
        </p>
      </Section>

      <Section title="What we cannot accept">
        <p>
          <strong>Hair, wigs and extensions</strong> cannot be returned once the seal or packaging is
          opened. This is a hygiene requirement, and it is the one exception EU law makes for goods
          that are sealed for health reasons. Unopened hair, still sealed, can be returned normally.
        </p>
        <p>
          Pierced jewellery is excluded for the same reason. Anything made or altered to your
          specification is also excluded, as it cannot be resold.
        </p>
      </Section>

      <Section title="How to return something">
        <ul>
          <li>
            Write to <a href="mailto:support@belioras.com">support@belioras.com</a> with your order
            number and which pieces are coming back.
          </li>
          <li>We will reply within one working day with a return label and address.</li>
          <li>Send it back within 14 days of telling us.</li>
        </ul>
        <p>
          Return postage is at your cost unless the piece arrived faulty or was not what you ordered,
          in which case we cover it.
        </p>
      </Section>

      <Section title="Your refund">
        <p>
          We refund within <strong>14 days</strong> of receiving the return, to the method you paid
          with, including the standard outbound shipping you originally paid. Where you chose a
          faster shipping option, we refund the standard rate.
        </p>
        <p>
          Your bank may take a further few working days to show it. If it has not appeared ten
          working days after we confirm the refund, tell us and we will chase it.
        </p>
      </Section>

      <Section title="Faulty pieces">
        <p>
          Nothing here limits your statutory rights. If a piece is faulty or not as described, you
          are entitled to a repair, replacement or refund, and EU law gives you two years to raise
          it. Write to <a href="mailto:support@belioras.com">support@belioras.com</a> with a photograph and
          we will put it right.
        </p>
      </Section>
    </PageShell>
  );
}
