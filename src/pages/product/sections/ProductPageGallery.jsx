/* Page: Product - ProductGallery */
import { useState } from "react";
import { Play } from "lucide-react";

import ProductVideo from "../../../components/storefront/ProductVideo";
import { cn } from "../../../utils/cn";

/**
 * The piece's photos, and its clip on the model when the colour has one. The
 * clip sits second, after the lead photo, so the page still opens on a
 * photograph and loads fast; its thumbnail carries a play mark.
 */
export default function ProductPageGallery({ images = [], video = null, name = "", imageClassName = "aspect-[3/4]" }) {
  const media = [
    ...images.slice(0, 1).map((src) => ({ kind: "image", src })),
    ...(video?.url ? [{ kind: "video", src: video.poster ?? images[0], video }] : []),
    ...images.slice(1).map((src) => ({ kind: "image", src })),
  ];
  const [active, setActive] = useState(0);

  if (!media.length) return <div className="aspect-[3/4] w-full bg-ivory-200" />;
  const current = media[Math.min(active, media.length - 1)];

  return (
    <div className="flex flex-col gap-4 md:flex-row-reverse">
      <div className="flex-1 overflow-hidden bg-ivory-200">
        {current.kind === "video" ? (
          <ProductVideo key={current.video.url} video={current.video} label={`${name}, on the model`} className={imageClassName} />
        ) : (
          <img src={current.src} alt={name} className={cn("h-full w-full object-cover", imageClassName)} />
        )}
      </div>

      {media.length > 1 && (
        <div className="flex gap-3 md:flex-col">
          {media.map((item, i) => (
            <button
              key={`${item.kind}:${item.src}:${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={item.kind === "video" ? "Watch it on the model" : `View image ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "relative w-16 shrink-0 overflow-hidden border transition-all",
                i === active ? "border-gold-600" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <img src={item.src} alt="" className="aspect-[3/4] w-full object-cover" />
              {item.kind === "video" && (
                <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-espresso/25">
                  <span className="flex size-7 items-center justify-center rounded-full bg-ivory-50/90 text-espresso">
                    <Play className="size-3.5 translate-x-px" />
                  </span>
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
