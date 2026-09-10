/* Ui Component: Button */
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "../../utils/cn";

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight = false,
  className,
  children,
  to,
  href,
  ...props
}) {

  const classes = cn(
    "btn",
    `btn-${size}`,
    `btn-${variant}`,
    // Keep the footprint identical while loading so the row does not jump.
    loading && "relative",
    className,
  );

  const content = (
    <>
      {loading ? (
        <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" />
      ) : (
        Icon && !iconRight && <Icon className="size-4 shrink-0" aria-hidden="true" />
      )}
      {children}
      {!loading && Icon && iconRight && <Icon className="size-4 shrink-0" aria-hidden="true" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes}
      {...props}
    >
      {content}
    </button>
  );
}
