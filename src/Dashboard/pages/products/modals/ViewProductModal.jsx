import { motion, AnimatePresence } from "motion/react";
import { X, Package, DollarSign, Box, CheckCircle, Clock, XCircle } from "lucide-react";
import { PRODUCT_STATUS } from "../../../lib/constants";

export default function ViewProductModal({ open, onClose, product }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="size-5 text-green-600" />;
      case "draft":
        return <Clock className="size-5 text-gray-600" />;
      case "out_of_stock":
        return <XCircle className="size-5 text-red-600" />;
      default:
        return <Box className="size-5 text-gray-600" />;
    }
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
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-umber-50">
              <h2 className="text-lg font-semibold text-espresso">Product Details</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-umber-50 transition-colors"
              >
                <X className="size-5 text-espresso/60" />
              </button>
            </div>

            {/* Content */}
            {product && (
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* Product Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="size-16 rounded-lg bg-umber-50 flex items-center justify-center shrink-0">
                    <Package className="size-8 text-espresso/40" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-espresso mb-1">{product.name}</h3>
                    <p className="text-sm text-espresso/60">ID: {product.id}</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-umber-50">
                    {getStatusIcon(product.status)}
                    <span className="text-sm font-medium text-espresso">
                      {PRODUCT_STATUS[product.status]?.label || product.status}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-umber-50/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="size-4 text-espresso/60" />
                      <span className="text-xs font-medium text-espresso/60 uppercase tracking-wider">Price</span>
                    </div>
                    <p className="text-lg font-semibold text-espresso">{product.price}</p>
                  </div>
                  <div className="bg-umber-50/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Box className="size-4 text-espresso/60" />
                      <span className="text-xs font-medium text-espresso/60 uppercase tracking-wider">Stock</span>
                    </div>
                    <p className="text-lg font-semibold text-espresso">{product.stock} units</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-espresso/60 uppercase tracking-wider mb-2">Category</label>
                    <p className="text-sm text-espresso">{product.category}</p>
                  </div>
                  {product.description && (
                    <div>
                      <label className="block text-xs font-medium text-espresso/60 uppercase tracking-wider mb-2">Description</label>
                      <p className="text-sm text-espresso leading-relaxed">{product.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
