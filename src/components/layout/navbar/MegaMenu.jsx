import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

import { NAV_LINKS } from "../../../utils/constants";

export default function MegaMenu({ category, onMouseEnter, onMouseLeave }) {
  if (!category || !category.sections) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={category.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.2 }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="absolute left-1/2 top-full mt-1 w-full max-w-7xl -translate-x-1/2 origin-top rounded-xl border border-umber-50 bg-ivory-50/98 text-espresso shadow-large backdrop-blur"
      >
        <div className="flex gap-12 p-10 justify-between">
          {category.sections.map((section, idx) => (
            <div key={idx} className="flex-1 space-y-4">
              <h3 className="font-display text-lg tracking-wide text-brown-500 border-b border-umber-50 pb-2 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item.slug}>
                    <Link
                      to={`/${item.slug}`}
                      className="block text-[14px] font-sans text-espresso/80 transition-colors hover:text-gold-500 hover:translate-x-1 duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}