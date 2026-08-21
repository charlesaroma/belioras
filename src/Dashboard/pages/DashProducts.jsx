import { Plus, Search, Filter } from "lucide-react";
import DashTable from "../components/DashTable";
import { PRODUCT_STATUS } from "../lib/constants";

const PRODUCTS = [
  { id: "PRD-001", name: "Silk Evening Dress", category: "Dresses", price: "$245.00", stock: 45, status: "active" },
  { id: "PRD-002", name: "Cashmere Blazer", category: "Outerwear", price: "$320.00", stock: 12, status: "active" },
  { id: "PRD-003", name: "Leather Handbag", category: "Accessories", price: "$189.00", stock: 0, status: "out_of_stock" },
  { id: "PRD-004", name: "Lace Cocktail Dress", category: "Dresses", price: "$156.00", stock: 28, status: "active" },
  { id: "PRD-005", name: "Wool Coat", category: "Outerwear", price: "$450.00", stock: 8, status: "active" },
  { id: "PRD-006", name: "Satin Heels", category: "Shoes", price: "$175.00", stock: 35, status: "draft" },
];

const PRODUCT_COLUMNS = [
  { key: "id", label: "ID" },
  { key: "name", label: "Product Name" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  { key: "stock", label: "Stock" },
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
];

export default function DashProducts() {
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
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-espresso text-ivory-50 text-sm font-medium hover:bg-espresso/80 transition-colors">
          <Plus className="size-4" />
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-umber-50 bg-white shadow-sm">
        <DashTable columns={PRODUCT_COLUMNS} data={PRODUCTS} onRowClick={(row) => console.log("View product:", row.id)} />
      </div>
    </div>
  );
}