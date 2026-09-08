import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "../../utils/cn";

/**
 * The button.
 *
 * `.btn` and its variants have existed in index.css since the token pass and
 * nothing used them — instead the same class string was pasted across the
 * account pages and the dashboard, so a change to the primary button meant
 * finding every copy. This is the one place that spends them.
 *
 * `to` renders a Link and `href` an anchor, because a control that navigates
 * should be a link even when it looks like a button — that is what gives it
 * middle-click, open-in-new-tab and a sensible context menu.
 *
 * `loading` disables the control and marks it aria-busy, which stops the
 * double-submit that every hand-rolled form in this repo is currently open to.
 */
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
