import { Link } from "react-router-dom";
import { motion } from "motion/react";

/** Terms and privacy, shown under the signup form only. */
export function SignupTerms() {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-8 text-center text-[10px] leading-relaxed text-espresso/40"
    >
      By creating an account you agree to our{" "}
      <Link to="/terms-of-service" className="underline hover:text-gold-700">
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link to="/privacy-policy" className="underline hover:text-gold-700">
        Privacy Policy
      </Link>
      .
    </motion.p>
  );
}

/**
 * Development only.
 *
 * This block printed a working administrator password on a page that is
 * publicly reachable in production, which defeated the RequireAuth guard on
 * /dashboard entirely — anyone who found the login page could sign in as an
 * admin. import.meta.env.DEV is false in any `vite build`, so this is stripped
 * from the deployed bundle rather than merely hidden. The customer address
 * also used to read mariana@belioras.com, which does not exist; the seed in
 * users.json is example.com.
 */
export function DemoAccountNote() {
  if (!import.meta.env.DEV) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-8 rounded-2xl border border-dashed border-umber-50 bg-ivory-100/50 p-4 text-xs leading-relaxed text-espresso/60"
    >
      <p className="mb-2 font-semibold text-espresso">Demo account (dev only)</p>
      <p>
        Password: <span className="font-mono text-gold-700">demo123</span>
      </p>
      <p className="mt-1">
        <span className="font-mono">mariana@example.com</span> — Customer
      </p>
      <p className="mt-2 text-espresso/40">Staff accounts are listed on the atelier door.</p>
    </motion.div>
  );
}
