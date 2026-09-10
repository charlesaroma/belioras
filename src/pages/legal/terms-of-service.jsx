/* Page: Legal - terms-of-service */
import PageShell, { DraftNotice, Section } from "../../components/layout/PageShell";

/* Terms Of Service Page */
export default function TermsOfServicePage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms of Service"
      intro="The terms you agree to when you buy from Belioras."
      meta="Last updated 8 September 2026"
    >
      <DraftNotice>
        These need review against Portuguese commercial law and the EU consumer rights directive
        before launch, particularly the liability and governing-law sections.
      </DraftNotice>

      <Section title="Who you are contracting with">
        <p>
          Belioras Maison Lda., Rua Augusta 118, 1100-053 Lisboa, Portugal. Buying from this store
          means accepting these terms.
        </p>
      </Section>

      <Section title="Orders">
        <p>
          Your order is an offer to buy. The contract forms when we email to confirm dispatch, not
          when you pay — so if a piece turns out to be unavailable, or was listed at an obviously
          wrong price, we may decline the order and refund you in full.
        </p>
        <p>
          Prices are in the currency shown and include 20% VAT. The currency selector converts for
          display; you are charged in euro at the rate applied at checkout.
        </p>
      </Section>

      <Section title="Availability">
        <p>
          We hold stock for the time it takes you to complete checkout. Where a piece sells out
          between your adding it and paying, we will tell you and refund that line.
        </p>
      </Section>

      <Section title="Photography and colour">
        <p>
          We photograph every piece as faithfully as we can, but screens vary and colour will never
          be exact. A difference in shade alone is not a fault — though it is a perfectly good reason
          to use your <a href="/return-and-refund-policy">right to return</a>.
        </p>
      </Section>

      <Section title="Your account">
        <p>
          Keep your password to yourself; you are responsible for what happens under your account. If
          you think someone else has access, tell us and change it. We may suspend an account we
          reasonably believe is being used fraudulently.
        </p>
      </Section>

      <Section title="Our content">
        <p>
          The photography, text and design on this site belong to Belioras Maison Lda. You are
          welcome to share links and images for personal, non-commercial purposes. Reselling our
          imagery, or using it to represent another business, is not permitted.
        </p>
      </Section>

      <Section title="Liability">
        <p>
          We do not limit our liability for death or personal injury caused by negligence, for fraud,
          or for anything else that cannot be limited by law. Beyond that, our liability for any
          order is limited to what you paid for it. None of this affects your statutory rights as a
          consumer.
        </p>
      </Section>

      <Section title="Governing law">
        <p>
          These terms are governed by Portuguese law. As a consumer you keep the protection of the
          mandatory laws of the country you live in, and may bring proceedings there.
        </p>
        <p>
          The European Commission&rsquo;s online dispute resolution platform is available at{" "}
          <a href="https://ec.europa.eu/odr" target="_blank" rel="noreferrer">
            ec.europa.eu/odr
          </a>
          .
        </p>
      </Section>
    </PageShell>
  );
}
