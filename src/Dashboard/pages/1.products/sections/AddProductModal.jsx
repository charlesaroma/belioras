import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, X as XIcon } from "lucide-react";

export default function AddProductModal({ open, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    status: "active",
    description: "",
  });
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      id: `PRD-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
      ...formData,
      price: `$${parseFloat(formData.price).toFixed(2)}`,
      stock: parseInt(formData.stock),
      colors,
      sizes,
    };
    onAdd(newProduct);
    onClose();
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      status: "active",
      description: "",
    });
    setColors([]);
    setSizes([]);
  };

  const addColor = () => {
    if (newColor.trim()) {
      setColors([...colors, newColor.trim()]);
      setNewColor("");
    }
  };

  const removeColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const addSize = () => {
    if (newSize.trim()) {
      setSizes([...sizes, newSize.trim()]);
      setNewSize("");
    }
  };

  const removeSize = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
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
              <h2 className="text-lg font-semibold text-espresso">Add New Product</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-umber-50 transition-colors"
              >
                <X className="size-5 text-espresso/60" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-espresso mb-2">Product Images</label>
                <div className="border-2 border-dashed border-umber-50 rounded-xl p-8 text-center hover:border-gold-500 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <div className="size-12 rounded-full bg-umber-50 flex items-center justify-center">
                      <svg className="size-6 text-espresso/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-sm text-espresso/60">Drag & drop images here, or click to browse</p>
                    <p className="text-xs text-espresso/40">PNG, JPG up to 10MB each</p>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-espresso mb-2">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-umber-50 focus:border-gold-500 focus:outline-none text-sm"
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-espresso mb-2">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-umber-50 focus:border-gold-500 focus:outline-none text-sm"
                  >
                    <option value="">Select category</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Hair">Hair</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-espresso mb-2">Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso/60">$</span>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-umber-50 focus:border-gold-500 focus:outline-none text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-espresso mb-2">Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-umber-50 focus:border-gold-500 focus:outline-none text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-espresso mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-umber-50 focus:border-gold-500 focus:outline-none text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-espresso mb-2">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-umber-50 focus:border-gold-500 focus:outline-none text-sm resize-none"
                  placeholder="Enter product description"
                />
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium text-espresso mb-2">Colors</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                    className="flex-1 px-4 py-2 rounded-lg border border-umber-50 focus:border-gold-500 focus:outline-none text-sm"
                    placeholder="Add color (e.g., Red, Blue)"
                  />
                  <button
                    type="button"
                    onClick={addColor}
                    className="px-4 py-2 rounded-lg bg-espresso text-ivory-50 text-sm hover:bg-espresso/80 transition-colors"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
                {colors.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-umber-50 text-sm text-espresso"
                      >
                        {color}
                        <button
                          type="button"
                          onClick={() => removeColor(index)}
                          className="hover:text-rose-600 transition-colors"
                        >
                          <XIcon className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-espresso mb-2">Sizes</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                    className="flex-1 px-4 py-2 rounded-lg border border-umber-50 focus:border-gold-500 focus:outline-none text-sm"
                    placeholder="Add size (e.g., S, M, L)"
                  />
                  <button
                    type="button"
                    onClick={addSize}
                    className="px-4 py-2 rounded-lg bg-espresso text-ivory-50 text-sm hover:bg-espresso/80 transition-colors"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
                {sizes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-umber-50 text-sm text-espresso"
                      >
                        {size}
                        <button
                          type="button"
                          onClick={() => removeSize(index)}
                          className="hover:text-rose-600 transition-colors"
                        >
                          <XIcon className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-umber-50">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg border border-umber-50 text-sm font-medium text-espresso hover:bg-umber-50/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-espresso text-ivory-50 text-sm font-medium hover:bg-espresso/80 transition-colors"
                >
                  Add Product
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
