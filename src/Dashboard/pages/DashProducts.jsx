import { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import DashTable from "../components/DashTable";
import { PRODUCT_STATUS } from "../lib/constants";
import AddProductModal from "./products/modals/AddProductModal";
import EditProductModal from "./products/modals/EditProductModal";
import DeleteProductModal from "./products/modals/DeleteProductModal";
import ViewProductModal from "./products/modals/ViewProductModal";

const PRODUCTS = [
  { id: "PRD-001", name: "Silk Evening Dress", category: "Dresses", price: "$245.00", stock: 45, status: "active", colors: ["Champagne", "Ebony", "Burgundy"], sizes: ["0", "2", "4", "6", "8", "10", "12", "14"] },
  { id: "PRD-002", name: "Cashmere Blazer", category: "Outerwear", price: "$320.00", stock: 12, status: "active", colors: ["Black", "Navy", "Camel"], sizes: ["XS", "S", "M", "L", "XL"] },
  { id: "PRD-003", name: "Leather Handbag", category: "Accessories", price: "$189.00", stock: 0, status: "out_of_stock", colors: ["Chestnut", "Ebony", "Caramel"], sizes: ["default"] },
  { id: "PRD-004", name: "Lace Cocktail Dress", category: "Dresses", price: "$156.00", stock: 28, status: "active", colors: ["Blush", "Sand", "Ebony"], sizes: ["0", "2", "4", "6", "8", "10", "12", "14"] },
  { id: "PRD-005", name: "Wool Coat", category: "Outerwear", price: "$450.00", stock: 8, status: "active", colors: ["Black", "Camel", "Red"], sizes: ["XS", "S", "M", "L", "XL"] },
  { id: "PRD-006", name: "Satin Heels", category: "Shoes", price: "$175.00", stock: 35, status: "draft", colors: ["Black", "Nude", "Gold"], sizes: ["36", "37", "38", "39", "40", "41"] },
];

export default function DashProducts() {
  const [products, setProducts] = useState(PRODUCTS);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const onAddProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const onEditProduct = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const onUpdateProduct = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const onDeleteProduct = (product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const onConfirmDelete = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const onViewProduct = (product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  const PRODUCT_COLUMNS = [
    { key: "id", label: "ID" },
    { key: "name", label: "Product Name" },
    { key: "category", label: "Category" },
    { key: "price", label: "Price" },
    { key: "stock", label: "Stock" },
    {
      key: "colors",
      label: "Colors",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.colors?.slice(0, 3).map((color, i) => (
            <span key={i} className="text-xs text-espresso/60">{color}</span>
          ))}
          {row.colors?.length > 3 && <span className="text-xs text-espresso/40">+{row.colors.length - 3}</span>}
        </div>
      )
    },
    {
      key: "sizes",
      label: "Sizes",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.sizes?.slice(0, 3).map((size, i) => (
            <span key={i} className="text-xs text-espresso/60">{size}</span>
          ))}
          {row.sizes?.length > 3 && <span className="text-xs text-espresso/40">+{row.sizes.length - 3}</span>}
        </div>
      )
    },
    { 
      key: "status", 
      label: "Status",
      render: (row) => (
        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
          row.status === "active" ? "bg-green-100 text-green-800" :
          row.status === "draft" ? "bg-gray-100 text-gray-800" :
          "bg-red-100 text-red-800"
        }`}>
          {PRODUCT_STATUS[row.status]?.label || row.status}
        </span>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewProduct(row)}
            className="p-1.5 rounded-lg hover:bg-umber-50 transition-colors text-espresso/60 hover:text-espresso"
            title="View"
          >
            <Eye className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onEditProduct(row)}
            className="p-1.5 rounded-lg hover:bg-umber-50 transition-colors text-espresso/60 hover:text-espresso"
            title="Edit"
          >
            <Edit className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onDeleteProduct(row)}
            className="p-1.5 rounded-lg hover:bg-rose-50 transition-colors text-espresso/60 hover:text-rose-600"
            title="Delete"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-espresso/40" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-umber-50 bg-white text-sm text-espresso placeholder:text-espresso/40 focus:border-gold-500 focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-umber-50 bg-white text-sm font-medium text-espresso hover:bg-umber-50/30 transition-colors">
            <Filter className="size-4" />
            Filter
          </button>
        </div>
        <button 
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-espresso text-ivory-50 text-sm font-medium hover:bg-espresso/80 transition-colors"
        >
          <Plus className="size-4" />
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-umber-50 bg-white shadow-sm">
        <DashTable columns={PRODUCT_COLUMNS} data={products} />
      </div>

      {/* Modals */}
      <AddProductModal 
        open={addModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        onAdd={onAddProduct}
      />
      <EditProductModal 
        open={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        product={selectedProduct}
        onUpdate={onUpdateProduct}
      />
      <DeleteProductModal 
        open={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        product={selectedProduct}
        onDelete={onConfirmDelete}
      />
      <ViewProductModal 
        open={viewModalOpen} 
        onClose={() => setViewModalOpen(false)} 
        product={selectedProduct}
      />
    </div>
  );
}