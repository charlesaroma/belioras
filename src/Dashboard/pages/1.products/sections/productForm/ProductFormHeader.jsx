import { Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";

import Button from "../../../../../components/ui/Button";

/** Back link, the discard-draft escape hatch, and the submit. */
export default function FormHeader({ isEdit, hasDraft, onDiscardDraft, submitting }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <Link
        to="/dashboard/products"
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-espresso-soft transition-colors hover:text-espresso"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        All products
      </Link>

      <div className="flex items-center gap-2">
        {!isEdit && hasDraft && (
          <button
            type="button"
            onClick={onDiscardDraft}
            className="text-[11px] uppercase tracking-[0.14em] text-espresso-soft underline underline-offset-4 hover:text-error"
          >
            Discard draft
          </button>
        )}
        <Button type="submit" icon={Check} loading={submitting}>
          {isEdit ? "Save changes" : "Add product"}
        </Button>
      </div>
    </div>
  );
}
