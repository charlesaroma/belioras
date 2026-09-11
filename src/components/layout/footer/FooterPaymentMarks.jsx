/* Payment Marks */
const MARKS = ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay", "Klarna"];

// Set as quiet wordmarks rather than the brands' own colours. Six saturated
// chips — Visa blue, Mastercard red, Klarna pink — were the loudest thing on
// a page built from espresso, ivory and gold, and they read as a payments
// widget bolted on rather than part of the house. Recognition still works:
// the names are what a shopper scans for.
export default function FooterPaymentMarks({ className = "" }) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-5 gap-y-2 ${className}`}>
      {MARKS.map((mark) => (
        <li
          key={mark}
          className="text-[10px] uppercase tracking-[0.18em] text-espresso/40 transition-colors"
        >
          {mark}
        </li>
      ))}
    </ul>
  );
}
