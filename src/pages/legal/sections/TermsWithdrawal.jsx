/* Page: Legal - TermsWithdrawal */
import { Section } from "../../../components/layout/PageShell";
import { BUSINESS } from "../legalDetails";
import BusinessAddress from "./BusinessAddress";

const FORM_FIELDS = ["Ordered on", "Received on", "Name", "Address", "Date", "Signature (only for paper submission)"];

/** The withdrawal policy and model withdrawal form, as EU law requires them to be given. */
export default function TermsWithdrawal() {
  return (
    <>
      <Section title="Withdrawal policy">
        <p>
          <strong>Right of withdrawal.</strong> You have the right to withdraw from this contract
          within 14 days without giving any reason. The period is 14 days from the day you, or a
          third party you name other than the carrier, received the goods.
        </p>
        <p>
          To withdraw, tell us clearly, for example by email to{" "}
          <a href={`mailto:${BUSINESS.support}`}>{BUSINESS.support}</a>. You can use the form below,
          but you don&rsquo;t have to. Sending your notice before the 14 days end is enough.
        </p>
        <p>
          <strong>Effects of withdrawal.</strong> We refund everything you paid, including the
          standard delivery cost, within 14 days of receiving your notice, using the payment method
          you used. We may wait to refund until the goods are back with us or you have shown that you
          sent them. You pay the cost of sending them back.
        </p>
        <p>
          <strong>Exclusions.</strong> The right of withdrawal does not apply to sealed goods unsuitable
          for return for health or hygiene reasons once unsealed after delivery (such as hair, wigs,
          extensions and cosmetics), or to goods made to your specification.
        </p>
      </Section>

      <Section title="Withdrawal form">
        <p>Complete and send this form only if you wish to withdraw from the contract.</p>
        <div className="space-y-3 border border-umber-50 bg-ivory-50 p-5 text-[14px]">
          <p>To:</p>
          <BusinessAddress />
          <p>I hereby withdraw from my contract for the purchase of the following goods:</p>
          <ul className="!list-none !pl-0">
            {FORM_FIELDS.map((f) => (
              <li key={f} className="border-b border-dashed border-umber-100 pb-2">
                {f}:
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
