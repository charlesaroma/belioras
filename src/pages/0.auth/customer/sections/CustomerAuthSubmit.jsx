/* Page: Auth - CustomerAuthSubmit */
import { Loader2 } from "lucide-react";

export default function CustomerAuthSubmit({ submitting, label, busyLabel }) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="w-full rounded-lg bg-espresso py-4 text-xs font-bold uppercase tracking-[0.2em] text-ivory-50 shadow-sm transition-all duration-200 hover:bg-gold-700 hover:text-espresso hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
    >
      {submitting ? (
        <span className="inline-flex items-center justify-center gap-2">
          <Loader2 className="size-4 animate-spin" />
          {busyLabel}
        </span>
      ) : (
        label
      )}
    </button>
  );
}
