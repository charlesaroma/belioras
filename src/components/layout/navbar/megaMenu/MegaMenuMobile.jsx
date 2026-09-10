/* Mega Menu: Drawer Variant */
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "../../../../utils/cn";
import { ITEM_VARIANTS, LIST_VARIANTS, sectionTransition } from "./megaMenuMotion";

export default function MegaMenuMobile({ item, sections, onNavigate }) {
  const [openSection, setOpenSection] = useState(null);
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col gap-6">
      <div>
        {sections.map((section, idx) => {
          // First section open by default so the drawer never opens blank.
          const isOpen = openSection === section.id || (openSection === null && idx === 0);

          // A lone section whose title restates the category it sits under
          // ("New Arrivals" inside New Arrivals) is a heading carrying no
          // information; its links stand on their own.
          const redundantHeading =
            sections.length === 1 &&
            section.title.toLowerCase() === (item.label ?? "").toLowerCase();

          if (redundantHeading) {
            return (
              <ul key={section.id} className="space-y-3 pb-2">
                {section.items.map((leaf) => (
                  <li key={leaf.id}>
                    <Link
                      to={leaf.url}
                      onClick={onNavigate}
                      className="block text-sm text-espresso transition-colors hover:text-gold-700"
                    >
                      {leaf.label}
                    </Link>
                  </li>
                ))}
              </ul>
            );
          }

          return (
            <div
              key={section.id}
              className={cn(
                "border-b border-l-2 border-umber-50/60 pl-3 transition-colors duration-300 last:border-b-0",
                isOpen ? "border-l-gold-500 bg-brown-50/40" : "border-l-transparent",
              )}
            >
              <button
                type="button"
                onClick={() => setOpenSection((cur) => (cur === section.id ? null : section.id))}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between py-3.5 pr-2 text-left"
              >
                <span className={cn("eyebrow", isOpen && "!text-espresso")}>{section.title}</span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-espresso-300 transition-transform duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isOpen && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>

              {/* Unmounting on collapse takes the links out of the tab order
                  for free, which the old grid-rows version did by hand. */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={sectionTransition(reduceMotion)}
                    className="overflow-hidden"
                  >
                    <motion.ul
                      className="space-y-3 pb-4"
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={LIST_VARIANTS}
                    >
                      {section.items.map((leaf) => (
                        <motion.li
                          key={leaf.id}
                          variants={reduceMotion ? {} : ITEM_VARIANTS}
                          transition={{ duration: 0.24, ease: "easeOut" }}
                        >
                          <Link
                            to={leaf.url}
                            onClick={onNavigate}
                            className="block text-sm text-espresso transition-colors hover:text-gold-700"
                          >
                            {leaf.label}
                          </Link>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Tiles are desktop-only. In the drawer they push the category list
          below the fold and turn a navigation aid into a scroll. */}
    </div>
  );
}
