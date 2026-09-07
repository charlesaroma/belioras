import { Lock, RotateCcw, ShieldCheck, Truck } from "lucide-react";

import { useAsyncData } from "../../../hooks/useAsyncData";
import { useContentVersion } from "../../../context/ContentContext";
import { getSettings } from "../../../services/settingsApi";

/**
 * Shipping, returns and security badges — confirmed for the homepage in the
 * design review.
 *
 * Copy comes from settings rather than being hardcoded here, which both removes
 * a duplicate of the same four items and makes them dashboard-editable.
 */
const ICONS = {
  truck: Truck,
  refresh: RotateCcw,
  shield: ShieldCheck,
  lock: Lock,
};

export default function TrustBadgesSection() {
  const version = useContentVersion();
  const { data: settings } = useAsyncData(getSettings, [version]);

  const items = settings?.valueProps ?? [];
  if (!items.length) return null;

  return (
    <section aria-label="Shopping perks" className="border-y border-umber-50 bg-ivory-50">
      <div className="container-main py-10">
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = ICONS[item.icon] ?? ShieldCheck;
            return (
              <li key={item.title} className="flex flex-col items-center text-center">
                <span className="mb-4 flex size-12 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-500">
                  <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3 className="mb-2 text-[14px] font-semibold uppercase tracking-[0.06em] text-espresso">
                  {item.title}
                </h3>
                <p className="max-w-[200px] text-[13px] leading-relaxed text-espresso-soft">
                  {item.text}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
