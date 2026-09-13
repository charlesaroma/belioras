/* Admin Dashboard Page: Products - ProductFormSaveBar */
import Button from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { publishLabels } from "./productFormPayload";

/** On smaller screens, where the side panel stacks below the form. */
export default function ProductFormSaveBar({ isEdit, status, submitting, onSave, className }) {
  const labels = publishLabels(isEdit, status);

  return (
    <div className={cn("sticky bottom-0 z-20 -mx-5 border-t border-umber-50 bg-ivory-50/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex min-w-0 items-center gap-2 truncate text-[12px] text-espresso-soft">
          <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", labels.live ? "bg-success" : "bg-umber-100")} />
          {labels.state}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <Button size="sm" variant="ghost" disabled={submitting} onClick={() => onSave("draft")}>
            {labels.secondary}
          </Button>
          <Button size="sm" loading={submitting} onClick={() => onSave("active")} className="bg-espresso text-ivory-50 hover:bg-espresso-600">
            {labels.primary}
          </Button>
        </div>
      </div>
    </div>
  );
}
