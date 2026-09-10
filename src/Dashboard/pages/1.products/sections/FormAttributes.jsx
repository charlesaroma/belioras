import { DIMENSION_ORDER, DIMENSION_PREFIX } from "../../../../utils/faceting";
import { cn } from "../../../../utils/cn";
import FormSection from "./FormSection";

/**
 * The taxonomy chips.
 *
 * These drive the filters and the mega menu, so a piece is only findable by
 * what is ticked here — which is why the hint says so out loud.
 */
export default function FormAttributes({ dimensions, tags, onToggle }) {
  return (
    <FormSection
      title="Attributes"
      hint="These drive the filters and the mega menu, so a piece is only findable by what is ticked here."
    >
      <div className="space-y-5">
        {DIMENSION_ORDER.filter((d) => dimensions[d]).map((dimension) => {
          const prefix = DIMENSION_PREFIX[dimension] ?? dimension;
          return (
            <div key={dimension}>
              <p className="input-label">{dimension}</p>
              <div className="flex flex-wrap gap-1.5">
                {dimensions[dimension].values.map((value) => {
                  const token = `${prefix}:${value.id}`;
                  const on = tags.includes(token);
                  return (
                    <button
                      key={value.id}
                      type="button"
                      onClick={() => onToggle(dimension, value.id)}
                      aria-pressed={on}
                      className={cn(
                        // min-h-9 keeps these a comfortable touch target; at
                        // py-1 they were 26px tall, well under the 44px
                        // guidance, and there are 64 of them packed together.
                        "min-h-9 border px-3 py-1.5 text-[12px] transition-colors",
                        on
                          ? "border-espresso bg-espresso text-ivory-50"
                          : "border-umber-50 text-espresso-soft hover:border-espresso/40 hover:text-espresso",
                      )}
                    >
                      {value.hex && (
                        <span
                          aria-hidden="true"
                          className="mr-1.5 inline-block size-2.5 translate-y-px border border-umber-50"
                          style={{ backgroundColor: value.hex }}
                        />
                      )}
                      {value.name}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </FormSection>
  );
}
