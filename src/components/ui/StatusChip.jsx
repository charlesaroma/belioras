import { ORDER_STATUS, PRODUCT_STATUS, STATUS_TONES } from "../../Dashboard/lib/constants";
import { cn } from "../../utils/cn";

const SETS = { order: ORDER_STATUS, product: PRODUCT_STATUS };

/**
 * The single status chip.
 *
 * Five different chip renderers existed across the dashboard and the account
 * pages, four of which reached past STATUS_TONES for stock Tailwind palette
 * colours — bg-green-100, bg-blue-100, bg-purple-100, bg-yellow-100 — that
 * belong to no part of the brand. STATUS_TONES was written to fix exactly
 * this and was wired into one of the five.
 *
 * An unknown status renders its raw key in the neutral tone rather than
 * disappearing, so a vocabulary mismatch is visible instead of silent. That
 * matters here: `paid` is absent from two of the three status maps in this
 * codebase, and under the old renderers those orders showed a blank chip.
 */
export default function StatusChip({ status, kind = "order", className }) {
  if (!status) return null;

  const entry = SETS[kind]?.[status];
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
