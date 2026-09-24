/* Admin Dashboard: SidebarFooter */
import { LogOut } from "lucide-react";

import Avatar from "../../../components/account/Avatar";
import { useStaffSignOut } from "@/context/auth/useSignOut";
import { cn } from "../../../utils/cn";

export default function SidebarFooter({ user, collapsed }) {
  const signOut = useStaffSignOut();

  return (
    <div className="shrink-0 border-t border-ivory-50/10 p-3">
      <div className={cn("mb-2 flex items-center gap-3 px-1", collapsed && "lg:justify-center lg:px-0")}>
        <Avatar user={user} size="sm" />
        <div className={cn("min-w-0", collapsed && "lg:hidden")}>
          {/* Reads the signed-in account rather than the hardcoded
              "Admin User" it previously always showed. */}
          <p className="truncate text-[13px] text-ivory-50">{user?.name ?? "Signed out"}</p>
          <p className="truncate text-[11px] text-ivory-50/45">{user?.email ?? "—"}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={signOut}
        title={collapsed ? "Sign out" : undefined}
        className={cn(
          "liquid-row flex w-full items-center gap-2.5 py-2.5 text-[12px] uppercase tracking-[0.14em] text-ivory-50/55 transition-colors hover:bg-ivory-50/5 hover:text-ivory-50",
          collapsed ? "px-4 lg:justify-center lg:px-0" : "px-4",
        )}
      >
        <LogOut className="liquid-glyph size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
        <span className={cn(collapsed && "lg:hidden")}>Sign out</span>
      </button>
    </div>
  );
}
