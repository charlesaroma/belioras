import { Search, Plus, MoreVertical } from "lucide-react";
import DashTable from "../components/DashTable";

const USERS = [
  { id: "USR-001", name: "Mariana Silva", email: "mariana@email.com", role: "customer", orders: 12, joined: "2024-01-10" },
  { id: "USR-002", name: "Emma Thompson", email: "emma@email.com", role: "customer", orders: 8, joined: "2024-01-08" },
  { id: "USR-003", name: "Sarah Johnson", email: "sarah@email.com", role: "admin", orders: 0, joined: "2024-01-05" },
  { id: "USR-004", name: "Lisa Chen", email: "lisa@email.com", role: "customer", orders: 5, joined: "2024-01-03" },
  { id: "USR-005", name: "Kate Williams", email: "kate@email.com", role: "customer", orders: 15, joined: "2024-01-01" },
];

const USER_COLUMNS = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { 
    key: "role", 
    label: "Role",
    render: (row) => (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
        row.role === "admin" ? "bg-gold-100 text-gold-800" : "bg-gray-100 text-gray-800"
      }`}>
        {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
      </span>
    )
  },
  { key: "orders", label: "Orders" },
  { key: "joined", label: "Joined" },
  {
    key: "actions",
    label: "",
    render: () => (
      <button className="text-espresso/40 hover:text-espresso transition-colors">
        <MoreVertical className="size-4" />
      </button>
    )
  },
];

export default function DashUsers() {
  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-espresso/40" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-umber-50 bg-white text-sm text-espresso placeholder:text-espresso/40 focus:border-gold-500 focus:outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-espresso text-ivory-50 text-sm font-medium hover:bg-espresso/80 transition-colors">
          <Plus className="size-4" />
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-umber-50 bg-white shadow-sm">
        <DashTable columns={USER_COLUMNS} data={USERS} onRowClick={(row) => console.log("View user:", row.id)} />
      </div>
    </div>
  );
}