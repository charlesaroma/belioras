import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";

/**
 * Editorial banner shared by /shop and every category route. Content is passed
 * in so a category page reads as itself rather than as "All Collections".
 */
function ShopHeader({
  eyebrow = "The Belioras Edit",
  title = "All Collections",
  subtitle = "Curated luxury fashion and premium hair, built around signature stories.",
  image = "https://ik.imagekit.io/sbgenu6wj/Belioras/Home/belioras-hero-2.jpeg",
  breadcrumb = [],
}) {
  return (
    <section
      className="relative h-[420px] md:h-[480px] overflow-hidden"
      aria-labelledby="shop-title"
    >
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/50 to-espresso/10" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-400 mb-4"
        >
          {eyebrow}
        </motion.p>

        <motion.h1
          id="shop-title"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl md:text-5xl text-ivory-50 tracking-wide mb-4"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-sm text-ivory-50/70 max-w-md leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}

        {breadcrumb.length > 0 && (
          <motion.nav
            aria-label="Breadcrumb"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6"
          >
            <ol className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-ivory-50/60">
              {breadcrumb.map((crumb, i) => (
                <li key={crumb.url} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="size-3" aria-hidden="true" />}
                  {i === breadcrumb.length - 1 ? (
                    <span aria-current="page" className="text-gold-400">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link to={crumb.url} className="transition-colors hover:text-ivory-50">
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </motion.nav>
        )}
      </div>
    </section>
  );
}

export default ShopHeader;
