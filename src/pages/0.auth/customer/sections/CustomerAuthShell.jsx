/* Page: Auth - CustomerAuthShell */
import { Link } from "react-router-dom";
import { motion } from "motion/react";

import BrandMark from "../../../../components/shared/BrandMark";
import { CUSTOMER_AUTH_COPY } from "./customerAuthCopy";

export default function CustomerAuthShell({ mode, children, footer }) {

  const copy = CUSTOMER_AUTH_COPY[mode];

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Editorial image panel — hidden below lg. */}
      <div className="relative hidden lg:block">
        <motion.img
          src={copy.heroImage}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/30 to-espresso/10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-12 left-12 right-12 text-ivory-50"
        >
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-gold-400">
            {copy.eyebrow}
          </p>
          <h2 className="mb-4 font-display text-4xl leading-tight xl:text-5xl">
            {copy.headline.map((line, i) => (
              <span key={line} className="block">
                {line}
                {i === 0 && copy.headline.length > 1 ? null : null}
              </span>
            ))}
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-ivory-50/60">{copy.body}</p>
        </motion.div>
      </div>

      {/* Form panel. */}
      <div className="flex min-h-screen flex-col items-center justify-center bg-ivory-50 px-6 py-12 sm:px-12 sm:py-16 lg:px-16 xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="w-full max-w-sm"
        >
          {/* The brand mark, and the only route back to the shop from here. It
              sits in the form column rather than the image panel because that
              panel is hidden below lg — so on a phone this was the one page
              with no Belioras branding anywhere on it. */}
          <BrandMark wrapperClassName="mb-10 block w-fit mx-auto lg:mx-0" />

          <div className="mb-10 text-center lg:text-left">
            <h1 className="mb-3 font-display text-3xl text-espresso lg:text-4xl">{copy.title}</h1>
            <p className="text-sm text-espresso/60">
              {copy.switchPrompt}{" "}
              <Link
                to={copy.switchTo}
                className="font-semibold text-gold-700 underline underline-offset-2 transition-colors hover:text-espresso"
              >
                {copy.switchLabel}
              </Link>
            </p>
          </div>

          {children}
          {footer}
        </motion.div>
      </div>
    </div>
  );
}
