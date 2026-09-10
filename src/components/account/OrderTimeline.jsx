/* Account Component: OrderTimeline */
import { ORDER_STAGES, isOffTimeline, stageOf } from "../../utils/orderStatus";
import { cn } from "../../utils/cn";

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
            <li key={stage.id} className={"flex gap-4"}>
              {/* Timeline Graphic Container */}
              <div className={"flex flex-col items-center"}>
                {/* Status Dot */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    done || current ? "bg-gold-500" : "bg-umber-100",
                  )}
                />
                {!last && (
                  /* Connecting Line */
                  <span
                    aria-hidden="true"
                    className={cn("w-px flex-1", done ? "bg-gold-500" : "bg-umber-100")}
                  />
                )}
              </div>

              {/* Stage Details */}
              <div className={cn("pb-8", last && "pb-0")}>
                {/* Stage Label */}
                <p
                  className={cn(
                    "text-sm",
                    current ? "text-espresso" : done ? "text-espresso-soft" : "text-espresso/35",
                  )}
                >
                  {stage.label}
                  {current && (
                    <span className={"ml-2 text-[10px] uppercase tracking-[0.16em] text-gold-700"}>
                      Now
                    </span>
                  )}
                </p>
                {/* Stage Blurb */}
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
          <li key={stage.id} className={"flex flex-1 items-start gap-3 py-2 sm:block"}>
            {/* Status Dot */}
            <span
              aria-hidden="true"
              className={cn(
                "mt-1 block size-2 shrink-0 rounded-full sm:mb-2 sm:mt-0",
                done || current ? "bg-gold-500" : "bg-umber-100",
              )}
            />
            {/* Stage Content */}
            <div>
              {/* Stage Label */}
              <p
                className={cn(
                  "text-[12px] uppercase tracking-[0.14em]",
                  current ? "text-espresso" : "text-espresso-soft",
                )}
              >
                {stage.label}
                {current && <span className="sr-only"> — current stage</span>}
              </p>
              {/* Stage Blurb */}
              <p className={"mt-0.5 text-[11px] leading-relaxed text-espresso-soft"}>{stage.blurb}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
