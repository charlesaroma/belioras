import { AlertTriangle } from "lucide-react";

import Modal from "../common/Modal";

import Button from "./Button";

/**
 * One destructive confirmation, replacing the two hand-built delete modals.
 *
 * Built on common/Modal, which already handles Escape, focus restore, scroll
 * lock, aria-modal and inert-while-hidden — none of which the dashboard's own
 * modals had. Reusing it is the whole point: a dialog that traps focus
 * correctly is not something to reimplement per feature.
 *
 * `summary` names the specific thing being destroyed. "Delete this product?"
 * asks the user to trust that the right row was clicked; showing the name
 * lets them verify it.
 */
export default function ConfirmDialog({
  open,
  onClose,
  // Distinct from onClose when the cancel button does something other than
  // simply dismiss — the idle warning uses it to sign out deliberately, while
  // Escape and the backdrop keep the session alive.
  onCancel,
  onConfirm,
  title = "Are you sure?",
  description,
  summary,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  destructive = true,
  loading = false,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} width="max-w-md">
      <div className="flex gap-4">
        {destructive && (
          <span className="flex size-10 shrink-0 items-center justify-center border border-error/25 text-error">
            <AlertTriangle className="size-5" strokeWidth={1.5} aria-hidden="true" />
          </span>
        )}

        <div className="min-w-0 flex-1">
          {description && (
            <p className="text-[14px] leading-relaxed text-espresso-soft">{description}</p>
          )}

          {summary && (
            <div className="mt-4 border border-umber-50 bg-brown-50/40 px-4 py-3 text-[13px] text-espresso">
              {summary}
            </div>
          )}
        </div>
      </div>

      <div className="mt-7 flex justify-end gap-3">
        <Button variant="ghost" size="md" onClick={onCancel ?? onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant={destructive ? "destructive" : "primary"}
          size="md"
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
