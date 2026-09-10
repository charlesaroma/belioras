/* Page: Legal - cookie-policy */
import PageShell, { DraftNotice, Section } from "../../components/layout/PageShell";

/* Cookie Policy Page */
export default function CookiePolicyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Cookie Policy"
      intro="What we store on your device, what each thing is for, and how to change your mind."
      meta="Last updated 8 September 2026"
    >
      <DraftNotice>
        The categories below describe what the store actually sets today. Once analytics or
        advertising tags are added, this page and the consent banner must be updated together.
      </DraftNotice>

      <Section title="Your choice comes first">
        <p>
          Nothing but strictly necessary storage is set before you choose. Under the ePrivacy
          Directive, consent is required in advance for anything else — so declining leaves the store
          fully usable, and you can change your answer at any time by clearing this site&rsquo;s data
          in your browser.
        </p>
      </Section>

      <Section title="Strictly necessary">
        <p>These cannot be switched off, because the store does not work without them.</p>
        <ul>
          <li>
            <strong>belioras:cart</strong> — the contents of your bag, so it survives a refresh.
          </li>
          <li>
            <strong>belioras:auth</strong> — keeps you signed in between visits.
          </li>
          <li>
            <strong>belioras:cookies</strong> — remembers the answer you gave to the cookie banner,
            so we stop asking.
          </li>
        </ul>
      </Section>

      <Section title="Preferences">
        <p>Not essential, but the store is worse without them.</p>
        <ul>
          <li>
            <strong>belioras:language</strong> and <strong>belioras:currency</strong> — so your
            choices persist between visits.
          </li>
          <li>
            <strong>belioras:wishlist</strong> — the pieces you have saved.
          </li>
          <li>
            <strong>belioras:gridColumns</strong> — how densely you prefer to view the catalogue.
          </li>
        </ul>
      </Section>

      <Section title="Analytics and advertising">
        <p>
          We currently set none. If that changes, this page will list each one before it is used,
          and it will be off until you opt in.
        </p>
      </Section>

      <Section title="Payment providers">
        <p>
          At checkout, our payment provider may set its own storage to detect fraud and complete
          your transaction securely. That is governed by their privacy policy, shown to you before
          you pay.
        </p>
      </Section>
    </PageShell>
  );
}
