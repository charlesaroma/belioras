/* Admin Dashboard: DashSidebar */
import { X } from "lucide-react";

import BrandMark from "../../components/shared/BrandMark";
import { useStaffAuth } from "@/context/auth/useAuthRealm";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { cn } from "../../utils/cn";
import { DASHBOARD_NAV_GROUPS } from "../lib/constants";
import SidebarNav from "./sidebar/SidebarNav";
import SidebarFooter from "./sidebar/SidebarFooter";

export default function DashSidebar({ isOpen, onClose }) {
  const { user, logout, can } = useStaffAuth();
  const [collapsed, setCollapsed] = useLocalStorage("belioras:dash:collapsed", false);

  // A group whose every item is out of reach for this role disappears with it.
  const groups = DASHBOARD_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.capability || can(item.capability)),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-espresso/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-espresso text-ivory-50",
          "transition-[transform,width] duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          // The drawer keeps its full width on a phone whatever the desktop
          // preference is; only the lg width responds to it.
          collapsed ? "w-64 lg:w-[72px]" : "w-64",
        )}
      >
        <div
          className={cn(
            "flex shrink-0 items-center border-b border-ivory-50/10 py-6",
            collapsed ? "justify-between px-4 lg:justify-center lg:px-0" : "justify-between px-6",
          )}
        >
          <BrandMark
            label="Belioras — storefront"
            size={collapsed ? "sm" : "md"}
            className={collapsed ? "lg:h-8" : undefined}
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-ivory-50/50 transition-colors hover:text-ivory-50 lg:hidden"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <SidebarNav groups={groups} collapsed={collapsed} onNavigate={onClose} />

        <SidebarFooter
          user={user}
          logout={logout}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((v) => !v)}
        />
      </aside>
    </>
  );
}
