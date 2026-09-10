/* Collapsible Filter Group */
import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "../../../../utils/cn";

export default function ShopFilterSection({ title, defaultOpen = false, selectedCount = 0, children }) {
  const [open, setOpen] = useState(defaultOpen);

  const isActive = selectedCount > 0;

  return (
    <div className="border-b border-umber-50 py-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left"
      >
        <span
          className={cn(
            "text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors",
            isActive ? "text-gold-700" : "text-espresso",
          )}
        >
          {title}
          {isActive && <span className="ml-1.5 tabular-nums">({selectedCount})</span>}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-espresso/40 transition-transform duration-300",
            !open && "-rotate-90",
          )}
          aria-hidden="true"
        />
      </button>

      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
