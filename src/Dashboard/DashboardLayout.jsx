import { useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import DashSidebar from "./components/DashSidebar";
import DashHeader from "./components/DashHeader";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const params = useParams();

  // Get current page from URL
  const currentPage = params.pageId || "overview";

  // Get page title
  const getPageTitle = (page) => {
    const titles = {
      overview: "Overview",
      products: "Products",
      orders: "Orders",
      users: "Users",
      settings: "Settings",
    };
    return titles[page] || "Dashboard";
  };

  return (
    <div className="min-h-screen bg-ivory-50 lg:pl-64">
      <DashSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="min-h-screen flex flex-col">
        <DashHeader 
          title={getPageTitle(currentPage)}
          onMenuToggle={() => setSidebarOpen(true)}
        />
        
        <main className="flex-1 px-6 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}