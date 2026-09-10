/* Page: Auth - CustomerAuthError */
import { motion } from "motion/react";

export default function CustomerAuthError({ message }) {
  if (!message) return null;

  return (
    <motion.p
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs text-rose-700"
      role="alert"
    >
      {message}
    </motion.p>
  );
}
