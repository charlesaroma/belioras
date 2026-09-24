/* Admin Dashboard Page: Orders - OrdersRestockDialog */
import ConfirmDialog from "../../../../../components/ui/ConfirmDialog";

/**
 * Asked when a shipped order is cancelled or refunded: are its pieces back on
 * the shelf? Asked, not assumed, since returning pieces that never came back
 * would sell stock the shop does not have. Escape leaves the order as it was.
 */
export default function OrdersRestockDialog({ ask, onAnswer, onClose }) {
  const units = ask?.units ?? 0;
  return (
    <ConfirmDialog
      open={Boolean(ask)}
      onClose={onClose}
      onConfirm={() => onAnswer(true)}
      onCancel={() => onAnswer(false)}
      destructive={false}
      title="Did the pieces come back?"
      description={ask && `Marking ${ask.order.id} ${ask.status}. It was shipped with ${units} ${units === 1 ? "piece" : "pieces"}. Return them to stock only if they are back on the shelf.`}
      confirmLabel={`Return ${units} to stock`}
      cancelLabel="Leave stock as it is"
    />
  );
}
