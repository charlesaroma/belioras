import ConfirmDialog from "../../../../../components/ui/ConfirmDialog";

/**
 * Delete confirmation.
 *
 * The summary names the piece and its price and stock, so an admin can see
 * they staged the row they meant before committing.
 */
export default function DeleteProductDialog({ product, format, onClose, onConfirm }) {
  return (
    <ConfirmDialog
      open={Boolean(product)}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete this piece?"
      description="It will be removed from the storefront immediately. You can undo this from the confirmation that follows."
      summary={
        product && (
          <span>
            <strong className="font-medium">{product.name}</strong>
            {" · "}
            {format(product.price)}
            {" · "}
            {product.stock} in stock
          </span>
        )
      }
      confirmLabel="Delete"
    />
  );
}
