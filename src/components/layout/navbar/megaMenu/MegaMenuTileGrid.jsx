/* Editorial Tiles */
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { cn } from "../../../../utils/cn";

export default function MegaMenuTileGrid({ tiles, onNavigate }) {

  return (
    <ul className={"grid h-[520px] grid-cols-2 gap-3"}>
      {tiles.slice(0, 2).map((tile, i) => (
        <li key={tile.id} className={i === 1 ? "h-[calc(100%-2rem)] self-end" : "h-full"}>
          <Link
            to={tile.url}
            onClick={onNavigate}
            className="group/tile relative block h-full overflow-hidden rounded-md"
          >
            <img
              src={tile.image}
              alt=""
              loading="lazy"
              className={cn(
                "w-full object-cover transition-transform duration-[600ms] ease-out group-hover/tile:scale-[1.06]",
                "h-full",
                // Offsetting the second tile turns two equal rectangles into a
                // composition, which is what makes it read as editorial.
                              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/85 via-espresso/25 to-transparent transition-opacity duration-300 group-hover/tile:from-espresso/95",
                "h-1/2",
                              )}
            />
            <span className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory-50">
                {tile.title}
              </span>
              <ArrowRight
                className="size-3.5 shrink-0 text-gold-400 transition-transform duration-300 group-hover/tile:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
