/* Storefront Component: CareIcon */

/**
 * The laundry-label symbols, drawn to one 24px grid in the current text colour
 * so they sit beside type. A crossed symbol means "do not".
 */
const cross = <path d="M4 4l16 16M20 4L4 20" />;
const tub = <path d="M3 8l2 11h14l2-11M3 8c1.5 1.4 3 1.4 4.5 0s3-1.4 4.5 0 3 1.4 4.5 0 3-1.4 4.5 0" />;
const iron = <path d="M2.5 18.5h19l-1.6-8.2A3 3 0 0 0 17 7.8H8.5c-3.4 0-6 3.6-6 7.2z" />;
const square = <rect x="3.5" y="3.5" width="17" height="17" rx="1" />;

const SHAPES = {
  "hand-wash": <>{tub}<path d="M10 11.5c.5-1.5 2-1.5 2.5 0l.5 2m-3.5-1.5.3 3.5h4" /></>,
  "wash-30": <>{tub}<text x="12" y="16.5" fontSize="6.5" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="inherit">30</text></>,
  "no-wash": <>{tub}{cross}</>,
  "no-bleach": <><path d="M12 4l9 16H3z" />{cross}</>,
  "hang-dry": <>{square}<path d="M6 8c2-2 10-2 12 0" /></>,
  "dry-flat": <>{square}<path d="M7 12h10" /></>,
  "no-tumble": <>{square}<circle cx="12" cy="12" r="5.5" />{cross}</>,
  "iron-1": <>{iron}<circle cx="12.5" cy="14.5" r="1" fill="currentColor" /></>,
  "iron-2": <>{iron}<circle cx="10.5" cy="14" r=".9" fill="currentColor" /><circle cx="13.5" cy="14" r=".9" fill="currentColor" /></>,
  "iron-3": <>{iron}<circle cx="9.5" cy="14" r=".9" fill="currentColor" /><circle cx="12" cy="14" r=".9" fill="currentColor" /><circle cx="14.5" cy="14" r=".9" fill="currentColor" /></>,
  steam: <>{iron}<path d="M9 7c-1-1 1-2 0-3M12 7c-1-1 1-2 0-3M15 7c-1-1 1-2 0-3" /></>,
  "no-iron": <>{iron}{cross}</>,
  "dry-clean": <><circle cx="12" cy="12" r="8.5" /><text x="12" y="15.5" fontSize="9" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="inherit">P</text></>,
  "no-dry-clean": <><circle cx="12" cy="12" r="8.5" />{cross}</>,
  hanger: <path d="M12 7.5a2 2 0 1 1 2-2M12 7.5v1.5L3.5 15.5c-.6.5-.3 1.5.5 1.5h16c.8 0 1.1-1 .5-1.5L12 9" />,
  bag: <><path d="M5 8h14l-1 12H6z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  "drop-off": <><path d="M12 3.5c3 4 5 6.6 5 9a5 5 0 0 1-10 0c0-2.4 2-5 5-9z" />{cross}</>,
  drop: <path d="M12 3.5c3 4 5 6.6 5 9a5 5 0 0 1-10 0c0-2.4 2-5 5-9z" />,
  cloth: <path d="M4 7h16v10H4zM4 11h16M8 7v10" />,
  sparkle: <path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />,
  "no-spray": <><path d="M9 9h6v11H9zM10.5 9V6.5h3V9M15 6.5h2M17.5 4.5l1.5-1M17.5 8.5l1.5 1" />{cross}</>,
  comb: <path d="M4 8h16v3H4zM6 11v6M9 11v6M12 11v6M15 11v6M18 11v6" />,
  stand: <path d="M12 4a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V8a4 4 0 0 1 4-4zM12 13v6M8 20h8" />,
};

export default function CareIcon({ name, className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {SHAPES[name] ?? SHAPES.drop}
    </svg>
  );
}
