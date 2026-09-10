/* Mega Menu: Panel Variant */
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import MegaMenuTileGrid from "./MegaMenuTileGrid";
import { COLUMN_STAGGER, ITEMS_PER_SECTION } from "./megaMenuMotion";

export default function MegaMenuDesktop({ item, sections, tiles, columns, showTiles, onNavigate }) {
  return (
    <div className="flex flex-col">
      <div className="flex gap-12 xl:gap-16">
        {/* Column count comes from the caller, derived from how much this
            category holds — see megaMenuLayout.js. */}
        <div
          className="grid min-w-0 flex-1 gap-x-10 gap-y-9 xl:gap-x-12"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {sections.map((section, i) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * COLUMN_STAGGER, ease: "easeOut" }}
              className="min-w-0"
            >
              <h3 className="eyebrow mb-4 flex items-center gap-2">
                {section.title}
                <span aria-hidden="true" className="h-px flex-1 bg-gold-500/25" />
              </h3>

              <ul className="space-y-2.5">
                {section.items.slice(0, ITEMS_PER_SECTION).map((leaf) => (
                  <li key={leaf.id}>
                    <Link
                      to={leaf.url}
                      onClick={onNavigate}
                      className="group/link relative inline-block text-[13px] leading-snug text-espresso transition-colors duration-200 hover:text-gold-700"
                    >
                      {leaf.label}
                      {/* Gold rule sweeping from the left — the same underline
                          language as the nav links above. */}
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold-500 transition-all duration-300 group-hover/link:w-full"
                      />
                    </Link>
                  </li>
                ))}

                {section.items.length > ITEMS_PER_SECTION && (
                  <li>
                    <Link
                      to={item.url}
                      onClick={onNavigate}
                      className="inline-flex items-center gap-1 pt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-700 transition-colors hover:text-espresso"
                    >
                      +{section.items.length - ITEMS_PER_SECTION} more
                    </Link>
                  </li>
                )}
              </ul>
            </motion.div>
          ))}
        </div>

        {showTiles && tiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: sections.length * COLUMN_STAGGER,
              ease: "easeOut",
            }}
            className="hidden w-[360px] shrink-0 xl:block"
          >
            <MegaMenuTileGrid tiles={tiles} onNavigate={onNavigate} />
          </motion.div>
        )}
      </div>

      {/* Gives the whole category one obvious destination — there was
          previously no way to browse a root wholesale. */}
      <div className="mt-8 flex items-center justify-between gap-6 border-t border-umber-50/60 pt-5">
        <Link
          to={item.url}
          onClick={onNavigate}
          className="group/all inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-espresso transition-colors hover:text-gold-700"
        >
          {/* "View all shop" reads as a stutter; the Shop root is everything. */}
          {item.id === "shop" ? "View all products" : `View all ${item.label.toLowerCase()}`}
          <ArrowRight
            className="size-3.5 transition-transform duration-300 group-hover/all:translate-x-1"
            aria-hidden="true"
          />
        </Link>

        <p className="hidden text-[11px] uppercase tracking-[0.16em] text-espresso-soft sm:block">
          Complimentary EU shipping over &euro;150
        </p>
      </div>
    </div>
  );
}
