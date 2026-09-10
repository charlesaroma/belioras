/* Quiet Utility Row */
import { Link } from "react-router-dom";

export default function MobileMenuQuietRow({ to, onClose, icon: Icon, label, meta }) {
  return (
    <Link
      to={to}
      onClick={onClose}
      className="flex min-h-11 items-center gap-3 text-sm text-espresso-soft transition-colors hover:text-gold-700"
    >
      <Icon className="size-4 shrink-0 text-espresso/35" strokeWidth={1.5} aria-hidden="true" />
      {label}
      {meta ? (
        <span className="ml-auto text-[11px] tabular-nums text-espresso/35">{meta}</span>
      ) : null}
    </Link>
  );
}
