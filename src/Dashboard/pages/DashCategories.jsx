import { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import DashTable from "../components/DashTable";
import AddCategoryModal from "./categories/modals/AddCategoryModal";
import EditCategoryModal from "./categories/modals/EditCategoryModal";
import DeleteCategoryModal from "./categories/modals/DeleteCategoryModal";
import ViewCategoryModal from "./categories/modals/ViewCategoryModal";

const CATEGORIES = [
  { id: "cat-001", name: "Mini Dresses", slug: "mini-dresses", productCount: 24, status: "active" },
  { id: "cat-002", name: "Midi Dresses", slug: "midi-dresses", productCount: 45, status: "active" },
  { id: "cat-003", name: "Maxi Dresses", slug: "maxi-dresses", productCount: 18, status: "active" },
  { id: "cat-004", name: "Prom & Gala", slug: "prom-gala", productCount: 12, status: "active" },
  { id: "cat-005", name: "Jumpsuits", slug: "jumpsuits", productCount: 8, status: "draft" },
  { id: "cat-006", name: "Two-Piece Sets", slug: "two-piece-sets", productCount: 15, status: "active" },
];

const CATEGORY_COLUMNS = [
  { key: "id", label: "ID" },
  { key: "name", label: "Category Name" },
  { key: "slug", label: "Slug" },
  { key: "productCount", label: "Products" },
  { 
    key: "status", 
    label: "Status",
    render: (row) => (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
        row.status === "active" ? "bg-green-100 text-green-800" :
        row.status === "draft" ? "bg-gray-100 text-gray-800" :
        "bg-red-100 text-red-800"
      }`}>
        {row.status}
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
          onClick={() => onViewCategory(row)}
          className="p-1.5 rounded-lg hover:bg-umber-50 transition-colors text-espresso/60 hover:text-espresso"
          title="View"
        >
          <Eye className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => onEditCategory(row)}
          className="p-1.5 rounded-lg hover:bg-umber-50 transition-colors text-espresso/60 hover:text-espresso"
          title="Edit"
        >
          <Edit className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => onDeleteCategory(row)}
          className="p-1.5 rounded-lg hover:bg-rose-50 transition-colors text-espresso/60 hover:text-rose-600"
          title="Delete"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    )
  },
];

export default function DashCategories() {
  const [categories, setCategories] = useState(CATEGORIES);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const onAddCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
  };

  const onEditCategory = (category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const onUpdateCategory = (updatedCategory) => {
    setCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
  };

  const onDeleteCategory = (category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const onConfirmDelete = (categoryId) => {
    setCategories(categories.filter(c => c.id !== categoryId));
  };

  const onViewCategory = (category) => {
    setSelectedCategory(category);
    setViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-espresso/40" />
            <input
              type="text"
              placeholder="Search categories..."
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
          Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="rounded-xl border border-umber-50 bg-white shadow-sm">
        <DashTable columns={CATEGORY_COLUMNS} data={categories} />
      </div>

      {/* Modals */}
      <AddCategoryModal 
        open={addModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        onAdd={onAddCategory}
      />
      <EditCategoryModal 
        open={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        category={selectedCategory}
        onUpdate={onUpdateCategory}
      />
      <DeleteCategoryModal 
        open={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        category={selectedCategory}
        onDelete={onConfirmDelete}
      />
      <ViewCategoryModal 
        open={viewModalOpen} 
        onClose={() => setViewModalOpen(false)} 
        category={selectedCategory}
      />
    </div>
  );
}
