/* Page: Auth - CustomerAuthInput */
import { motion } from "motion/react";

const inputBase =
  "w-full border-b border-umber-50 bg-transparent px-0 py-3 text-sm text-espresso placeholder:text-espresso/40 focus:border-espresso focus:outline-none transition-colors";

export default function CustomerAuthInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  rightSlot,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <label
        htmlFor={id}
        className={`pointer-events-none absolute top-3 text-xs font-semibold uppercase tracking-widest transition-all duration-200 ${
          value ? "-translate-y-5 text-[10px] text-espresso/50" : "text-espresso/40"
        }`}
      >
        {label}
      </label>
      <div className="flex items-center">
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className={`${inputBase} ${error ? "border-rose-400" : ""} ${rightSlot ? "pr-8" : ""}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {rightSlot && <span className="absolute right-0 flex items-center">{rightSlot}</span>}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-rose-600" role="alert">
          {error}
        </p>
      )}
    </motion.div>
  );
}
