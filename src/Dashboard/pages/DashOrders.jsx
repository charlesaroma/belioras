import { Search, Filter, Download } from "lucide-react";
import DashTable from "../components/DashTable";
import { ORDER_STATUS } from "../lib/constants";

const ORDERS = [
  { id: "ORD-001", customer: "Mariana Silva", email: "mariana@email.com", total: "$245.00", status: "delivered", date: "2024-01-15" },
  { id: "ORD-002", customer: "Emma Thompson", email: "emma@email.com", total: "$189.00", status: "processing", date: "2024-01-15" },
  { id: "ORD-003", customer: "Sarah Johnson", email: "sarah@email.com", total: "$320.00", status: "shipped", date: "2024-01-14" },
  { id: "ORD-004", customer: "Lisa Chen", email: "lisa@email.com", total: "$156.00", status: "pending", date: "2024-01-14" },
  { id: "ORD-005", customer: "Kate Williams", email: "kate@email.com", total: "$275.00", status: "delivered", date: "2024-01-13" },
  { id: "ORD-006", customer: "Amy Davis", email: "amy@email.com", total: "$198.00", status: "cancelled", date: "2024-01-12" },
];

const ORDER_COLUMNS = [
  { key: "id", label: "Order ID" },
  { key: "customer", label: "Customer" },
  { key: "email", label: "Email" },
  { key: "total", label: "Total" },
  { 
    key: "status", 
    label: "Status",
    render: (row) => (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
        row.status === "delivered" ? "bg-green-100 text-green-800" :
        row.status === "processing" ? "bg-blue-100 text-blue-800" :
        row.status === "shipped" ? "bg-purple-100 text-purple-800" :
        row.status === "pending" ? "bg-yellow-100 text-yellow-800" :
        "bg-red-100 text-red-800"
      }`}>
        {ORDER_STATUS[row.status]?.label || row.status}
      </span>
    )
  },
  { key: "date", label: "Date" },
];

export default function DashOrders() {
  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-espresso/40" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-umber-50 bg-white text-sm text-espresso placeholder:text-espresso/40 focus:border-gold-500 focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-umber-50 bg-white text-sm font-medium text-espresso hover:bg-umber-50/30 transition-colors">
            <Filter className="size-4" />
            Filter
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-umber-50 bg-white text-sm font-medium text-espresso hover:bg-umber-50/30 transition-colors">
          <Download className="size-4" />
          Export
        </button>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-umber-50 bg-white shadow-sm">
        <DashTable columns={ORDER_COLUMNS} data={ORDERS} onRowClick={(row) => console.log("View order:", row.id)} />
      </div>
    </div>
  );
}