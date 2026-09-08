import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

import { cn } from "../../utils/cn";

/**
 * 403.
 *
 * A signed-in customer who typed /dashboard used to be silently teleported to
 * their account overview — no message, nothing to explain why the page they
 * asked for became a different page. Silence reads as a bug.
 *
 * Two contexts, because the guard fails in two places. Refusing the whole
 * dashboard replaces the shell, so it fills the screen and offers the
 * storefront. Refusing one section inside the dashboard renders in the
 * content column with the sidebar still there, so it stays compact and offers
 * the sections that person can actually use.
 */
export default function Forbidden({
  title = "Not your door",
  message = "This part of Belioras is for the atelier team. Your account does not have access to it.",
  standalone = true,
  actions,
}) {
  const fallback = (
    <>
      <Link to="/account" className="btn btn-primary btn-lg">
        Go to your account
      </Link>
      <Link to="/shop" className="btn btn-secondary btn-lg">
        Back to the shop
      </Link>
    </>
  );

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 text-center",
        standalone ? "min-h-dvh bg-ivory-50" : "border border-umber-50 bg-ivory-50 py-20",
      )}
    >
      <span className="flex size-12 items-center justify-center border border-umber-50 text-gold-700">
        <Lock className="size-5" strokeWidth={1.5} aria-hidden="true" />
      </span>

      <p className="eyebrow mt-6">Error 403</p>
      <h1
        className={cn(
          "mt-3 font-display text-espresso",
          standalone ? "text-4xl sm:text-5xl" : "text-3xl",
        )}
      >
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-espresso-soft">
        {message}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">{actions ?? fallback}</div>
    </div>
  );
}
