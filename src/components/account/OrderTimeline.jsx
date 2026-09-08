import { ORDER_STAGES, isOffTimeline, stageOf } from "../../utils/orderStatus";
import { cn } from "../../utils/cn";

/**
 * Where an order has reached, across the four agreed stages.
 *
 * Shared because three surfaces show it: the account order detail, the public
 * order tracker and the account overview. The stage vocabulary already lived in
 * utils/orderStatus, but each surface drew its own markup — which is how the
 * tracker ended up with a `refunded` case the account pages never had.
 *
 * Two orientations because the two contexts genuinely differ. Horizontal reads
 * as a summary band above an order's detail; vertical, with a rule connecting
 * the marks, reads as a progress report and is what the standalone tracker
 * wants. Same stages, same source of truth, one component.
 *
 * Returns nothing for an order that has left the timeline. A cancelled or
 * refunded order needs its own sentence, not a timeline with the first dot lit;
 * the caller supplies that.
 */
export default function OrderTimeline({
  status,
  orientation = "horizontal",
  bordered = true,
  className,
}) {
  const index = stageOf(status);
  if (isOffTimeline(status) || index === null) return null;

  const vertical = orientation === "vertical";

  return (
    <ol
      className={cn(
        vertical ? "space-y-0" : "flex flex-col gap-0 sm:flex-row sm:gap-4",
        bordered && !vertical && "border border-umber-50 p-5",
        className,
      )}
    >
      {ORDER_STAGES.map((stage, i) => {
        const done = i < index;
        const current = i === index;
        const last = i === ORDER_STAGES.length - 1;

        if (vertical) {
          return (
            <li key={stage.id} className="flex gap-4">
              {/* The rule connects the marks into a single line of progress;
                  the last stage has nothing below it. */}
              <div className="flex flex-col items-center">
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    done || current ? "bg-gold-500" : "bg-umber-100",
                  )}
                />
                {!last && (
                  <span
                    aria-hidden="true"
                    className={cn("w-px flex-1", done ? "bg-gold-500" : "bg-umber-100")}
                  />
                )}
              </div>

              <div className={cn("pb-8", last && "pb-0")}>
                <p
                  className={cn(
                    "text-sm",
                    current ? "text-espresso" : done ? "text-espresso-soft" : "text-espresso/35",
                  )}
                >
                  {stage.label}
                  {current && (
                    <span className="ml-2 text-[10px] uppercase tracking-[0.16em] text-gold-700">
                      Now
                    </span>
                  )}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-[13px]",
                    i <= index ? "text-espresso-soft" : "text-espresso/30",
                  )}
                >
                  {stage.blurb}
                </p>
              </div>
            </li>
          );
        }

        return (
          <li key={stage.id} className="flex flex-1 items-start gap-3 py-2 sm:block">
            <span
              aria-hidden="true"
              className={cn(
                "mt-1 block size-2 shrink-0 rounded-full sm:mb-2 sm:mt-0",
                done || current ? "bg-gold-500" : "bg-umber-100",
              )}
            />
            <div>
              <p
                className={cn(
                  "text-[12px] uppercase tracking-[0.14em]",
                  current ? "text-espresso" : "text-espresso-soft",
                )}
              >
                {stage.label}
                {current && <span className="sr-only"> — current stage</span>}
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-espresso-soft">{stage.blurb}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
