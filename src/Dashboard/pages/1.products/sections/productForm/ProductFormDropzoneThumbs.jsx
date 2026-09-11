/* Uploaded Image Thumbnails */
import { Star, X } from "lucide-react";

import { cn } from "../../../../../utils/cn";

// The first image is the one shoppers see in the grid, so promoting one is a
// first-class action rather than a reorder drag.
export default function ProductFormDropzoneThumbs({ images, onRemove, onMakePrimary, disabled }) {
  if (!images.length) return null;

  return (
  <ul className="mt-3 grid grid-cols-4 gap-2">
    {images.map((image, i) => (
      <li key={image.id ?? image.url} className="group relative border border-umber-50">
        <img
          src={image.url}
          alt={image.name ? `Preview of ${image.name}` : "Product image"}
          className="aspect-square w-full object-cover"
        />

        {i === 0 && (
          <span className="absolute left-0 top-0 bg-espresso px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-ivory-50">
            Primary
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 p-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
          {i !== 0 && (
            <button
              type="button"
              onClick={() => onMakePrimary(i)}
              aria-label={`Make image ${i + 1} the primary image`}
              className="flex size-6 items-center justify-center bg-espresso/85 text-ivory-50 transition-colors hover:bg-espresso"
            >
              <Star className="size-3" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            onClick={() => onRemove(i)}
            aria-label={`Remove image ${i + 1}`}
            className="flex size-6 items-center justify-center bg-espresso/85 text-ivory-50 transition-colors hover:bg-error"
          >
            <X className="size-3" aria-hidden="true" />
          </button>
        </div>
      </li>
    ))}
  </ul>
  );
}
