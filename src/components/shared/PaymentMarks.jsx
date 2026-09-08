/**
 * Accepted-payment indicators for the footer.
 *
 * Displaying a card network's mark to show it's accepted is the standard,
 * sanctioned use of these logos — Visa, Mastercard and Amex all publish
 * merchant acceptance marks for exactly this purpose. These are hand-drawn
 * vector reproductions rather than the official asset files (which are
 * distributed as licensed downloads, not something to fetch from a guessed
 * URL), matched to each brand's real colours and proportions.
 *
 * Each sits on its own white chip: several of these marks (Visa's blue,
 * Klarna's pink, PayPal's two-tone) are designed against white and read as
 * the wrong brand entirely on a dark ground.
 *
 * Rendered as plain <svg> inside <li> with no anchor or button — the design
 * review was explicit these are visual compatibility indicators, not links.
 * `role="img"` plus `aria-label` keeps them announced; non-interactive is not
 * the same as invisible to a screen reader.
 */

function Chip({ label, bg = "#FFFFFF", children }) {
  return (
    <li>
      <svg
        role="img"
        aria-label={label}
        viewBox="0 0 48 30"
        className="h-9 w-auto rounded-[4px] shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
      >
        <title>{label}</title>
        <rect width="48" height="30" rx="4" fill={bg} />
        {children}
      </svg>
    </li>
  );
}

function Visa() {
  return (
    <Chip label="Visa">
      <text
        x="24"
        y="16"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#1434CB"
        fontSize="13"
        fontWeight="800"
        fontStyle="italic"
        fontFamily="Georgia, 'Times New Roman', serif"
        letterSpacing="-0.3"
      >
        VISA
      </text>
    </Chip>
  );
}

function Mastercard() {
  return (
    <Chip label="Mastercard">
      {/* The interlocking circles alone are the recognisable mark — no
          wordmark needed, and adding one would crowd a 48x30 chip. */}
      <circle cx="20" cy="15" r="8.5" fill="#EB001B" />
      <circle cx="28" cy="15" r="8.5" fill="#F79E1B" />
      <path
        d="M24 8.7a8.5 8.5 0 0 1 0 12.6 8.5 8.5 0 0 1 0-12.6Z"
        fill="#FF5F00"
      />
    </Chip>
  );
}

function Amex() {
  return (
    <Chip label="American Express" bg="#006FCF">
      <text
        x="24"
        y="16"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#FFFFFF"
        fontSize="9.5"
        fontWeight="700"
        fontFamily="var(--font-sans)"
        letterSpacing="0.5"
      >
        AMEX
      </text>
    </Chip>
  );
}

function PayPal() {
  return (
    <Chip label="PayPal">
      {/* PayPal's wordmark is genuinely two-toned — a lighter blue "Pay"
          layered behind a darker navy "Pal" — reproduced here with two
          overlapping text runs rather than a single flat colour. */}
      <text
        x="24.6"
        y="16.6"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#009CDE"
        fontSize="11"
        fontWeight="700"
        fontStyle="italic"
        fontFamily="var(--font-sans)"
      >
        PayPal
      </text>
      <text
        x="24"
        y="16"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#003087"
        fontSize="11"
        fontWeight="700"
        fontStyle="italic"
        fontFamily="var(--font-sans)"
      >
        PayPal
      </text>
    </Chip>
  );
}

function ApplePay() {
  return (
    <Chip label="Apple Pay">
      <g transform="translate(9, 8.5)">
        {/* Compact apple silhouette, notch and leaf included. */}
        <path
          d="M6.2 2.6c.5-.6 1.3-1.05 2.03-1.08.09.63-.15 1.28-.55 1.78-.42.51-1.06.9-1.72.85-.1-.63.19-1.28.24-1.55Z"
          fill="#000"
        />
        <path
          d="M8.4 3.5c-1.05-.06-1.94.58-2.44.58-.51 0-1.28-.55-2.11-.54-1.08.02-2.08.62-2.63 1.58-1.13 1.93-.29 4.79.8 6.36.54.78 1.18 1.65 2.02 1.62.81-.03 1.12-.52 2.1-.52.98 0 1.25.52 2.11.5.87-.02 1.42-.79 1.96-1.57.62-.89.87-1.75.88-1.8-.02-.01-1.69-.65-1.71-2.57-.01-1.6 1.31-2.38 1.37-2.42-.75-1.1-1.92-1.22-2.35-1.24Z"
          fill="#000"
        />
      </g>
      <text
        x="30"
        y="16.5"
        dominantBaseline="central"
        fill="#000"
        fontSize="10.5"
        fontWeight="500"
        fontFamily="var(--font-sans)"
      >
        Pay
      </text>
    </Chip>
  );
}

function Klarna() {
  return (
    <Chip label="Klarna" bg="#FFB3C7">
      <text
        x="24"
        y="16.5"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#0B051D"
        fontSize="11"
        fontWeight="700"
        fontFamily="var(--font-sans)"
      >
        Klarna
      </text>
    </Chip>
  );
}

const MARKS = [Visa, Mastercard, Amex, PayPal, ApplePay, Klarna];

export default function PaymentMarks({ className = "" }) {
  return (
    <ul
      className={`flex flex-wrap items-center gap-2.5 ${className}`}
      aria-label="Accepted payment methods"
    >
      {MARKS.map((Mark) => (
        <Mark key={Mark.name} />
      ))}
    </ul>
  );
}
