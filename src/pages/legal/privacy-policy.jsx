/* Page: Legal - privacy-policy */
import PageShell, { DraftNotice, Section } from "../../components/layout/PageShell";

/* Privacy Policy Page */
export default function PrivacyPolicyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy Policy"
      intro="What we collect when you shop with Belioras, why we hold it, and how to get it back or have it erased."
      meta="Last updated 8 September 2026"
    >
      <DraftNotice>
        It states our real practices but has not been reviewed by a lawyer. Before launch it needs
        checking against GDPR and Portuguese implementing law, and the CNPD registration details
        confirmed.
      </DraftNotice>

      <Section title="Who we are">
        <p>
          Belioras Maison Lda., Rua Augusta 118, 1100-053 Lisboa, Portugal, is the data controller
          for the personal data described here. For any privacy question, or to exercise the rights
          below, write to <a href="mailto:info@belioras.com">info@belioras.com</a>.
        </p>
      </Section>

      <Section title="What we collect">
        <ul>
          <li>
            <strong>When you order:</strong> name, delivery and billing address, email, phone
            number, and the contents of your order.
          </li>
          <li>
            <strong>When you create an account:</strong> your email, a hashed password, and any
            saved addresses and preferences.
          </li>
          <li>
            <strong>When you browse:</strong> pages and products viewed, and items saved to your
            bag or wishlist.
          </li>
          <li>
            <strong>When you subscribe:</strong> your email address, until you unsubscribe.
          </li>
        </ul>
        <p>
          We never see or store your full card number. Card details go directly to our payment
          provider; we receive only the last four digits and the result.
        </p>
      </Section>

      <Section title="Why we hold it">
        <ul>
          <li>
            <strong>To fulfil your order</strong> — performance of our contract with you. Without
            this data we cannot ship to you.
          </li>
          <li>
            <strong>To meet our legal obligations</strong> — Portuguese tax law requires us to keep
            invoices and transaction records.
          </li>
          <li>
            <strong>To improve the store</strong> — our legitimate interest in understanding which
            pieces people look for. You can object to this at any time.
          </li>
          <li>
            <strong>To send you the newsletter</strong> — your consent, withdrawable from any email
            or by writing to us.
          </li>
        </ul>
      </Section>

      <Section title="Who else sees it">
        <p>
          Only those who need it to get your order to you: our payment providers, our delivery
          carriers, and the services that host this store and send our email. Each acts on our
          written instructions and may not use your data for anything else. We do not sell your
          personal data, and we never have.
        </p>
        <p>
          Where a provider operates outside the European Economic Area, the transfer is covered by
          the European Commission&rsquo;s Standard Contractual Clauses.
        </p>
      </Section>

      <Section title="How long we keep it">
        <p>
          Order and invoice records are kept for ten years, as Portuguese tax law requires. Account
          data is kept until you close your account. Newsletter data is kept until you unsubscribe.
          Browsing data is kept for twenty-four months.
        </p>
      </Section>

      <Section title="Your rights">
        <p>
          Under the GDPR you may ask us for a copy of your data, correct it, have it erased, restrict
          or object to how we use it, or receive it in a portable format. Where we rely on consent,
          you may withdraw it at any time without affecting what came before.
        </p>
        <p>
          Write to <a href="mailto:info@belioras.com">info@belioras.com</a> and we will respond
          within one month. If you are not satisfied, you may complain to the Comissão Nacional de
          Protecção de Dados (CNPD), Portugal&rsquo;s supervisory authority.
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          We set only what is necessary until you choose otherwise. See our{" "}
          <a href="/cookie-policy">cookie policy</a> for the detail and to change your mind.
        </p>
      </Section>
    </PageShell>
  );
}
