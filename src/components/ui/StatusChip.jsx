/* Ui Component: StatusChip */
import { PRODUCT_STATUS, STATUS_TONES } from "../../Dashboard/lib/constants";
import { ORDER_STATUS, normalizeStatus } from "../../utils/orderStatus";
import { cn } from "../../utils/cn";

const SETS = { order: ORDER_STATUS, product: PRODUCT_STATUS };

export default function StatusChip({ status, kind = "order", className }) {
  if (!status) return null;

  // Orders arrive in several dialects — the fixtures say "delivered", the
  // dashboard says "to-review". Resolve to canonical before looking up, so a
  // legacy value gets its real chip instead of the neutral fallback.
  const key = kind === "order" ? (normalizeStatus(status) ?? status) : status;

  const entry = SETS[kind]?.[key];
  const label = entry?.label ?? String(status).replace(/[-_]/g, " ");
  const tone = STATUS_TONES[entry?.tone ?? "neutral"];

  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
        tone,
        className,
      )}
    >
      {label}
    </span>
  );
}
