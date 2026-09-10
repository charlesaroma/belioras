/* Layout Component: Forbidden */
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

import { cn } from "../../utils/cn";

export default function Forbidden({
  title = "Not your door",
  message = "This part of Belioras is for the atelier team. Your account does not have access to it.",
  standalone = true,
  actions,
}) {
  /* Fallback Action Links */
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
      {/* Error Icon */}
      <span className="flex size-12 items-center justify-center border border-umber-50 text-gold-700">
        <Lock className="size-5" strokeWidth={1.5} aria-hidden="true" />
      </span>

      <p className="eyebrow mt-6">Error 403</p>
      
      {/* Error Message */}
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

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">{actions ?? fallback}</div>
    </div>
  );
}
