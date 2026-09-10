/* Colour And Size Filters */
import { cn } from "../../../../utils/cn";

export default function SearchPanelFacets({
  colourSwatches,
  colours,
  onToggleColour,
  sizeChips,
  sizes,
  onToggleSize,
}) {
  return (
    <div className="flex flex-row gap-10 lg:flex-col lg:gap-8">
      {colourSwatches.length > 0 && (
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-espresso">
            Colour
          </p>
          {/* The swatch stays 28px; the button around it is 44px on touch. */}
          <div className="-mx-2 flex max-w-[220px] flex-wrap lg:mx-0 lg:max-w-[180px] lg:gap-2">
            {colourSwatches.map((c) => {
              const active = colours.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onToggleColour(c.id)}
                  aria-pressed={active}
                  aria-label={c.name}
                  title={c.name}
                  className="flex size-11 items-center justify-center lg:size-7"
                >
                  <span
                    className={cn(
                      "size-7 border transition-all",
                      active
                        ? "border-transparent ring-2 ring-espresso ring-offset-1"
                        : "border-umber-100 hover:border-espresso/40",
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sizeChips.length > 0 && (
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-espresso">
            Size
          </p>
          <div className="flex flex-wrap gap-2">
            {sizeChips.map((s) => {
              const active = sizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onToggleSize(s)}
                  aria-pressed={active}
                  className={cn(
                    "flex h-11 min-w-11 items-center justify-center border px-2 text-xs uppercase transition-all lg:h-8 lg:min-w-[34px]",
                    active
                      ? "border-espresso bg-espresso text-ivory-50"
                      : "border-umber-100 text-espresso-soft hover:border-espresso",
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
