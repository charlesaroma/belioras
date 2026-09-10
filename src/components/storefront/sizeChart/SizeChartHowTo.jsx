import SizeChartFigure from "./SizeChartFigure";

/**
 * How to take each measurement.
 *
 * The figure and the list say the same thing twice on purpose: the drawing is
 * faster to read, the list is the one that works with a screen reader and
 * survives being printed.
 */
export default function SizeChartHowTo({ steps, showFigure = true }) {
  return (
    <div className="grid gap-8 sm:grid-cols-[auto_1fr] sm:items-start">
      {showFigure && (
        <div className="mx-auto sm:mx-0">
          <SizeChartFigure />
        </div>
      )}

      <ol className="space-y-4">
        {steps.map((step, i) => (
          <li key={step.term} className="flex gap-3 text-[13px] leading-relaxed">
            <span
              aria-hidden="true"
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brown-50 text-[11px] font-semibold tabular-nums text-espresso"
            >
              {i + 1}
            </span>
            <span className="text-espresso-soft">
              <strong className="font-semibold text-espresso">{step.term}. </strong>
              {step.text}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
