
export default function SizeChartFigure({ className = "" }) {
  return (
    <svg
      viewBox="0 0 260 420"
      role="img"
      aria-label="A figure showing where the shoulder, bust, waist, hip and inside leg are measured"
      className={`h-auto w-full max-w-[260px] ${className}`}
    >
      <g
        fill="none"
        stroke="var(--color-espresso)"
        strokeOpacity="0.55"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* head and neck */}
        <ellipse cx="130" cy="34" rx="20" ry="25" />
        <path d="M122 58v10M138 58v10" />
        {/* shoulders, arms */}
        <path d="M130 68c-22 0-38 6-44 14l-10 74c-1 8 1 14 4 18" />
        <path d="M130 68c22 0 38 6 44 14l10 74c1 8-1 14-4 18" />
        {/* torso to hip */}
        <path d="M86 82c-4 26-5 52-3 76 1 12 0 24-2 36 14 6 34 8 49 8s35-2 49-8c-2-12-3-24-2-36 2-24 1-50-3-76" />
        {/* legs */}
        <path d="M104 202c-2 40-3 90-2 130 0 22 1 44 3 62h18c1-30 3-70 5-104 1-22 2-44 2-64" />
        <path d="M156 202c2 40 3 90 2 130 0 22-1 44-3 62h-18c-1-30-3-70-5-104" />
        {/* feet */}
        <path d="M105 394h18M137 394h18" />
      </g>

      {/* Measurement lines. Gold, so they read as annotation over the figure. */}
      <g stroke="var(--color-gold-600)" strokeWidth="1.5" strokeLinecap="round">
        <path d="M84 84h92" />
        <path d="M86 128h88" />
        <path d="M88 168h84" />
        <path d="M84 208h92" />
        <path d="M130 214v180" />
      </g>

      {/* Callouts. */}
      <g
        fontSize="10"
        fontWeight="600"
        letterSpacing="1.2"
        fill="var(--color-espresso)"
        textAnchor="middle"
      >
        <Callout x={130} y={84} label="SHOULDER" width={74} />
        <Callout x={130} y={128} label="BUST" width={48} />
        <Callout x={130} y={168} label="WAIST" width={54} />
        <Callout x={130} y={208} label="HIP" width={40} />
        <Callout x={62} y={300} label="INSIDE LEG" width={80} />
      </g>
    </svg>
  );
}

function Callout({ x, y, label, width }) {
  return (
    <g>
      <rect
        x={x - width / 2}
        y={y - 9}
        width={width}
        height={18}
        rx={9}
        fill="var(--color-gold-500)"
        stroke="none"
      />
      <text x={x} y={y + 4} fill="var(--color-espresso)">
        {label}
      </text>
    </g>
  );
}
