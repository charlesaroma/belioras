import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X } from "lucide-react";

export default function DeleteProductModal({ open, onClose, product, onDelete }) {
  const handleDelete = () => {
    onDelete(product.id);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-espresso/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-umber-50">
              <h2 className="text-lg font-semibold text-espresso">Delete Product</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-umber-50 transition-colors"
              >
                <X className="size-5 text-espresso/60" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="size-12 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="size-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-espresso mb-1">
                    Are you sure you want to delete this product?
                  </h3>
                  <p className="text-sm text-espresso/60">
                    This action cannot be undone. This will permanently delete the product "{product?.name}" from your inventory.
                  </p>
                </div>
              </div>

              {/* Product Info */}
              {product && (
                <div className="bg-umber-50/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-espresso">{product.name}</p>
                      <p className="text-xs text-espresso/60">ID: {product.id}</p>
                    </div>
                    <p className="text-sm font-semibold text-espresso">{product.price}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg border border-umber-50 text-sm font-medium text-espresso hover:bg-umber-50/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-6 py-2.5 rounded-lg bg-rose-600 text-ivory-50 text-sm font-medium hover:bg-rose-700 transition-colors"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
