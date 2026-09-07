/**
 * Accepted-payment indicators for the footer.
 *
 * Rendered as plain <svg> inside <li> with no anchor or button anywhere: the
 * review was explicit that these are visual compatibility indicators, not
 * links. `role="img"` plus `aria-label` keeps them announced — non-interactive
 * is not the same as invisible to a screen reader.
 *
 * These are simplified wordmarks. Before launch they should be swapped for each
 * network's official merchant acceptance mark, which are trademarked and come
 * with their own usage rules.
 */

const MARKS = [
  { id: "visa", label: "Visa", text: "VISA", weight: 700, style: "italic" },
  { id: "mastercard", label: "Mastercard", custom: "mastercard" },
  { id: "amex", label: "American Express", text: "AMEX", weight: 700 },
  { id: "paypal", label: "PayPal", text: "PayPal", weight: 600, style: "italic" },
  { id: "applepay", label: "Apple Pay", text: " Pay", weight: 500 },
  { id: "klarna", label: "Klarna", text: "Klarna", weight: 600 },
];

function MarkFrame({ label, children }) {
  return (
    <li>
      <svg
        role="img"
        aria-label={label}
        viewBox="0 0 48 30"
        className="h-7 w-auto rounded-[3px] bg-ivory-50/10 ring-1 ring-ivory-50/15"
      >
        <title>{label}</title>
        {children}
      </svg>
    </li>
  );
}

export default function PaymentMarks({ className = "" }) {
  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`} aria-label="Accepted payment methods">
      {MARKS.map((mark) =>
        mark.custom === "mastercard" ? (
          <MarkFrame key={mark.id} label={mark.label}>
            <circle cx="20" cy="15" r="8" fill="#EB001B" opacity="0.9" />
            <circle cx="28" cy="15" r="8" fill="#F79E1B" opacity="0.9" />
          </MarkFrame>
        ) : (
          <MarkFrame key={mark.id} label={mark.label}>
            <text
              x="24"
              y="15"
              textAnchor="middle"
              dominantBaseline="central"
              fill="currentColor"
              fontSize="9"
              fontWeight={mark.weight}
              fontStyle={mark.style}
              fontFamily="var(--font-sans)"
            >
              {mark.text}
            </text>
          </MarkFrame>
        ),
      )}
    </ul>
  );
}
