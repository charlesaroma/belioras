import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import DashSidebar from "./components/DashSidebar";
import DashHeader from "./components/DashHeader";
import { DASHBOARD_NAV_ITEMS } from "./lib/constants";

/**
 * Admin shell.
 *
 * The title was previously derived from `params.pageId`, a param that does not
 * exist anywhere in the route configuration — so every page in the dashboard
 * displayed "Overview". It now comes from the pathname, matched against the
 * same nav list the sidebar renders, so the two can't disagree.
 */
export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const segment = pathname.replace(/^\/dashboard\/?/, "").split("/")[0] || "overview";
  const title = DASHBOARD_NAV_ITEMS.find((item) => item.id === segment)?.label ?? "Dashboard";

  return (
    <div className="min-h-dvh bg-ivory-500 lg:pl-64">
      <DashSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-dvh flex-col">
        <DashHeader title={title} onMenuToggle={() => setSidebarOpen(true)} />

        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
