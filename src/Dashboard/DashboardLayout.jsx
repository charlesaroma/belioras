/* Admin Dashboard: DashboardLayout */
import { useCallback, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useStaffAuth } from "@/context/auth/useAuthRealm";
import { useToast } from "../context/ToastContext";
import { useIdleTimeout } from "../hooks/useIdleTimeout";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { cn } from "../utils/cn";
import DashSidebar from "./components/DashSidebar";
import DashHeader from "./components/DashHeader";
import { DASHBOARD_NAV_ITEMS } from "./lib/constants";

/* IDLE TIMEOUT */
const IDLE_TIMEOUT = 30 * 60 * 1000;

/* IDLE WARNING */
const IDLE_WARNING = 2 * 60 * 1000;

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed] = useLocalStorage("belioras:dash:collapsed", false);
  const { pathname } = useLocation();

  const navigate = useNavigate();
  const { logout } = useStaffAuth();
  const { toast } = useToast();

  const segment = pathname.replace(/^\/dashboard\/?/, "").split("/")[0] || "overview";

  const title = DASHBOARD_NAV_ITEMS.find((item) => item.id === segment)?.label ?? "Dashboard";

  const onIdle = useCallback(async () => {
    await logout();
    navigate("/atelier", { replace: true });
    toast("Signed out after 30 minutes of inactivity.", "info");
  }, [logout, navigate, toast]);

  const { warning, extend } = useIdleTimeout({
    timeout: IDLE_TIMEOUT,
    warnBefore: IDLE_WARNING,
    onIdle,
  });

  return (
    <div
      className={cn(
        "min-h-dvh bg-ivory-500 transition-[padding] duration-300",
        // Mirrors the sidebar's own width. Both read the same stored
        // preference rather than one telling the other, so a reload cannot
        // leave the shell and the rail disagreeing.
        collapsed ? "lg:pl-[72px]" : "lg:pl-64",
      )}
    >
      <DashSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-dvh flex-col">
        <DashHeader title={title} onMenuToggle={() => setSidebarOpen(true)} />

        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>

      {/*
        Warned, not ambushed. Any real activity also cancels this — the dialog
        is for someone who has stepped away, not someone still typing. An
        in-progress product draft survives the sign-out regardless; that is
        what the draft dock is for.
      */}
      <ConfirmDialog
        open={warning}
        // Escape or the backdrop means someone is at the keyboard, so both
        // keep the session. Only the explicit button signs out.
        onClose={extend}
        onCancel={onIdle}
        onConfirm={extend}
        destructive={false}
        title="Still there?"
        description="For security, atelier sessions end after 30 minutes without activity. You will be signed out in about two minutes."
        confirmLabel="Keep working"
        cancelLabel="Sign out now"
      />
    </div>
  );
}
