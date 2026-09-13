/* Uploaded Image Thumbnails */
import { Star, X } from "lucide-react";

import { cn } from "@/utils/cn";

/**
 * Photos in a portrait grid, each with a swatch row to tag the colour it
 * shows. Promoting a photo to lead is a button rather than a drag, so it works
 * by keyboard and on touch.
 */
export default function ProductFormDropzoneThumbs({ images, onRemove, onMakePrimary, swatches = [], onTag }) {
  if (!images.length) return null;

  return (
    <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-5">
      {images.map((image, i) => {
        const tagged = swatches.find((s) => s.id === image.colorId);
        return (
          <li key={image.id ?? image.url} className="group border border-umber-50 bg-white">
            <div className="relative">
              <img
                src={image.url}
                alt={image.name ? `Preview of ${image.name}` : `Photo ${i + 1}`}
                className="aspect-[3/4] w-full object-cover"
              />
              {i === 0 && (
                <span className="absolute left-0 top-0 bg-espresso px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-ivory-50">
                  Lead
                </span>
              )}
              <div className="absolute right-1 top-1 flex gap-1 transition-opacity lg:opacity-0 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100">
                {i !== 0 && (
                  <button type="button" onClick={() => onMakePrimary(i)} aria-label={`Make photo ${i + 1} the lead photo`} className="flex size-7 items-center justify-center bg-espresso/85 text-ivory-50 transition-colors hover:bg-espresso">
                    <Star className="size-3.5" aria-hidden="true" />
                  </button>
                )}
                <button type="button" onClick={() => onRemove(i)} aria-label={`Remove photo ${i + 1}`} className="flex size-7 items-center justify-center bg-espresso/85 text-ivory-50 transition-colors hover:bg-error">
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {onTag && (
              <div className="px-1 pb-1.5 pt-1">
                <div role="group" aria-label={`Colour shown in photo ${i + 1}`} className="flex flex-wrap items-center">
                  {swatches.length === 0 ? (
                    <span className="px-1 py-1.5 text-[10px] text-espresso-soft">No colours yet</span>
                  ) : (
                    swatches.map((s) => {
                      const on = image.colorId === s.id;
                      return (
                        <button key={s.id} type="button" aria-pressed={on} aria-label={`Photo ${i + 1} shows ${s.name}`} title={s.name} onClick={() => onTag(i, s.id)} className="flex size-8 items-center justify-center">
                          <span
                            aria-hidden="true"
                            className={cn("size-5 border transition", on ? "border-espresso ring-1 ring-espresso ring-offset-1" : "border-umber-100 opacity-55 hover:opacity-100")}
                            style={{ backgroundColor: s.hex }}
                          />
                        </button>
                      );
                    })
                  )}
                </div>
                {swatches.length > 0 && (
                  <p className={cn("truncate px-1 text-[10px] tracking-[0.02em]", tagged ? "text-espresso" : "text-gold-700")}>
                    {tagged?.name ?? "Tag its colour"}
                  </p>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
