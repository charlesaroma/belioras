import { motion, AnimatePresence } from "motion/react";
import { X, Package, Tag, CheckCircle, Clock, XCircle } from "lucide-react";

export default function ViewCategoryModal({ open, onClose, category }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="size-5 text-green-600" />;
      case "draft":
        return <Clock className="size-5 text-gray-600" />;
      default:
        return <XCircle className="size-5 text-red-600" />;
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
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-umber-50">
              <h2 className="text-lg font-semibold text-espresso">Category Details</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-umber-50 transition-colors"
              >
                <X className="size-5 text-espresso/60" />
              </button>
            </div>

            {/* Content */}
            {category && (
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* Category Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="size-16 rounded-lg bg-umber-50 flex items-center justify-center shrink-0">
                    <Tag className="size-8 text-espresso/40" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-espresso mb-1">{category.name}</h3>
                    <p className="text-sm text-espresso/60">ID: {category.id}</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-umber-50">
                    {getStatusIcon(category.status)}
                    <span className="text-sm font-medium text-espresso">{category.status}</span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-umber-50/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="size-4 text-espresso/60" />
                      <span className="text-xs font-medium text-espresso/60 uppercase tracking-wider">Products</span>
                    </div>
                    <p className="text-lg font-semibold text-espresso">{category.productCount}</p>
                  </div>
                  <div className="bg-umber-50/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="size-4 text-espresso/60" />
                      <span className="text-xs font-medium text-espresso/60 uppercase tracking-wider">Slug</span>
                    </div>
                    <p className="text-sm font-medium text-espresso">{category.slug}</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-4">
                  {category.description && (
                    <div>
                      <label className="block text-xs font-medium text-espresso/60 uppercase tracking-wider mb-2">Description</label>
                      <p className="text-sm text-espresso leading-relaxed">{category.description}</p>
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
