import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

export default function MegaMenu({ category, onMouseEnter, onMouseLeave }) {
  if (!category || !category.sections) return null;

  const sectionCount = category.sections.length;

  return (
    <AnimatePresence>
      <motion.div
        key={category.id}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="w-full border-t border-umber-50/60 bg-ivory-50/98 text-espresso shadow-large backdrop-blur"
        role="navigation"
        aria-label={`${category.label} menu`}
      >
        <div className="mx-auto max-w-7xl px-8 xl:px-16 2xl:px-24 py-8">
          <div
            className="grid gap-x-10 gap-y-6"
            style={{
              gridTemplateColumns: `repeat(${Math.min(sectionCount, 6)}, minmax(0, 1fr))`,
            }}
          >
            {category.sections.map((section, idx) => (
              <div key={idx} className="min-w-0">
                <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-brown-500 border-b border-umber-50/60 pb-2">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        to={`/${item.slug}`}
                        className="block text-[13px] text-espresso/75 transition-all duration-150 hover:text-gold-600 hover:translate-x-0.5"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}