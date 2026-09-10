/* Ui Component: ConfirmDialog */
import { AlertTriangle } from "lucide-react";

import Modal from "../common/Modal";

import Button from "./Button";

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
