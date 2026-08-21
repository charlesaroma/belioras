import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  X
} from "lucide-react";
import { DASHBOARD_NAV_ITEMS } from "../lib/constants";

const iconMap = {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
};

export default function DashSidebar({ isOpen, onClose, currentPage }) {

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-espresso/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-espresso text-ivory-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-espresso/20">
          <Link to="/" className="flex items-center gap-2">
            <img src="/belioras-logo.png" alt="Belioras" className="h-8 w-auto" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden text-ivory-50/60 hover:text-ivory-50"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-1">
          {DASHBOARD_NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = currentPage === item.id;
            return (
              <Link
                key={item.id}
                to={`/dashboard/${item.id}`}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gold-500 text-espresso"
                    : "text-ivory-50/70 hover:bg-espresso/20 hover:text-ivory-50"
                }`}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-espresso/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-full bg-gold-500 flex items-center justify-center text-espresso font-semibold">
              A
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-ivory-50/60">admin@belioras.com</p>
            </div>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm font-medium text-ivory-50/70 hover:bg-espresso/20 hover:text-ivory-50 transition-colors"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}