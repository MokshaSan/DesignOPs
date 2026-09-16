import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppShell } from "./AppShell";
import { NAV_CONFIG } from "@/routes/navConfig";
import { useStore } from "@/store/useStore";
import type { Role } from "@/types";

export function RoleLayout({ role }: { role: Exclude<Role, "visitor"> }) {
  const location = useLocation();
  const { role: activeRole, setRole } = useStore();
  const items = NAV_CONFIG[role];
  const match = items.find((i) => (i.end ? location.pathname === i.to : location.pathname.startsWith(i.to)));
  const title = match?.label ?? "Dashboard";

  useEffect(() => {
    if (activeRole !== role) setRole(role);
  }, [role, activeRole, setRole]);

  return (
    <AppShell role={role} title={title}>
      <Outlet />
    </AppShell>
  );
}
