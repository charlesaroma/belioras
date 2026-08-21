import { 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign 
} from "lucide-react";
import StatCard from "../components/StatCard";
import SalesChart from "../components/SalesChart";
import DashTable from "../components/DashTable";

const SALES_DATA = [
  { name: "Jan", sales: 12000 },
  { name: "Feb", sales: 19000 },
  { name: "Mar", sales: 15000 },
  { name: "Apr", sales: 22000 },
  { name: "May", sales: 28000 },
  { name: "Jun", sales: 24000 },
];

const RECENT_ORDERS = [
  { id: "ORD-001", customer: "Mariana Silva", total: "$245.00", status: "delivered", date: "2024-01-15" },
  { id: "ORD-002", customer: "Emma Thompson", total: "$189.00", status: "processing", date: "2024-01-15" },
  { id: "ORD-003", customer: "Sarah Johnson", total: "$320.00", status: "shipped", date: "2024-01-14" },
  { id: "ORD-004", customer: "Lisa Chen", total: "$156.00", status: "pending", date: "2024-01-14" },
  { id: "ORD-005", customer: "Kate Williams", total: "$275.00", status: "delivered", date: "2024-01-13" },
];

const ORDER_COLUMNS = [
  { key: "id", label: "Order ID" },
  { key: "customer", label: "Customer" },
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
        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
      </span>
    )
  },
  { key: "date", label: "Date" },
];

export default function DashOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value="$124,500"
          change="+12.5%"
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Total Orders"
          value="1,234"
          change="+8.2%"
          icon={ShoppingCart}
          trend="up"
        />
        <StatCard
          title="Total Products"
          value="89"
          change="+2"
          icon={Package}
          trend="up"
        />
        <StatCard
          title="Total Users"
          value="3,456"
          change="+15.3%"
          icon={Users}
          trend="up"
        />
      </div>

      {/* Sales Chart */}
      <div className="rounded-xl border border-umber-50 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-espresso mb-4">Sales Overview</h2>
        <SalesChart data={SALES_DATA} />
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-umber-50 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-espresso">Recent Orders</h2>
          <button className="text-sm font-medium text-gold-700 hover:text-gold-600">
            View All
          </button>
        </div>
        <DashTable columns={ORDER_COLUMNS} data={RECENT_ORDERS} />
      </div>
    </div>
  );
}