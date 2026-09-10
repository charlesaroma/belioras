/* Page: Product - ProductGallery */
import { useState } from "react";

import { cn } from "../../../utils/cn";

export default function ProductGallery({ images = [], name = "" }) {
  const [active, setActive] = useState(0);

  if (!images.length) return <div className="aspect-[3/4] w-full bg-ivory-200" />;

  return (
    <div className="flex flex-col gap-4 md:flex-row-reverse">
      <div className="flex-1 overflow-hidden bg-ivory-200">
        <img
          src={images[active]}
          alt={name}
          className="aspect-[3/4] h-full w-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 md:flex-col">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "w-16 shrink-0 overflow-hidden border transition-all",
                i === active
                  ? "border-gold-600"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <img src={src} alt="" className="aspect-[3/4] w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
