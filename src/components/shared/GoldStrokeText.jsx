import { useEffect, useId, useRef, useState } from "react";

/**
 * Black text outlined in a gold gradient — the slogan treatment agreed in the
 * design review, for legibility over pale and busy hero imagery.
 *
 * Rendered as SVG rather than CSS because `-webkit-text-stroke` only accepts a
 * solid colour: it cannot take a gradient at all. An SVG stroke accepts a paint
 * server, and `paint-order="stroke"` draws the stroke behind the fill so the
 * black glyph is not eaten into from both sides.
 *
 * The trade is that SVG text does not reflow, so this is for short display
 * lines. Body copy should use a solid colour over `.glass` instead.
 */
export default function GoldStrokeText({
  children,
  className,
  strokeWidth = 2,
  fill = "#120700",
  as: Tag = "span",
}) {
  const gradientId = useId();
  const textRef = useRef(null);
  const [box, setBox] = useState(null);

  // Measure after layout, and again once webfonts land — measuring against the
  // fallback serif would size the viewBox to the wrong metrics.
  useEffect(() => {
    const measure = () => {
      if (!textRef.current) return;
      const { width, height } = textRef.current.getBBox();
      setBox({ width, height });
    };

    measure();
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });
    window.addEventListener("resize", measure);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", measure);
    };
  }, [children]);

  const pad = strokeWidth * 2;

  return (
    <Tag className={className}>
      {/* The visible mark is decorative to assistive tech; the real text is
          exposed once, below, so it is never announced twice. */}
      <svg
        aria-hidden="true"
        focusable="false"
        className="block w-full overflow-visible"
        viewBox={box ? `0 0 ${box.width + pad} ${box.height + pad}` : undefined}
        style={{ height: "1.15em" }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e6cb98" />
            <stop offset="45%" stopColor="#d9b166" />
            <stop offset="100%" stopColor="#f2d680" />
          </linearGradient>
        </defs>
        <text
          ref={textRef}
          x={pad / 2}
          y="1em"
          fill={fill}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          paintOrder="stroke"
          fontSize="1em"
          fontFamily="var(--font-display)"
          dominantBaseline="text-before-edge"
        >
          {children}
        </text>
      </svg>
      <span className="sr-only">{children}</span>
    </Tag>
  );
}
