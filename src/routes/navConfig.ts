import type { Role } from "@/types";

export interface NavItem {
  to: string;
  label: string;
  icon: string; // lucide icon name, resolved in Sidebar
  end?: boolean;
}

export const NAV_CONFIG: Record<Exclude<Role, "visitor">, NavItem[]> = {
  resident: [
    { to: "/resident", label: "Dashboard", icon: "LayoutDashboard", end: true },
    { to: "/resident/scenes", label: "Scenes", icon: "Sparkles" },
    { to: "/resident/automation", label: "Automation", icon: "Workflow" },
    { to: "/resident/energy", label: "Energy", icon: "Zap" },
    { to: "/resident/access", label: "Access", icon: "Fingerprint" },
    { to: "/resident/visitors", label: "Visitors", icon: "Users" },
    { to: "/resident/facilities", label: "Facilities", icon: "MapPin" },
    { to: "/resident/notifications", label: "Notifications", icon: "Bell" },
    { to: "/resident/profile", label: "Profile", icon: "UserCircle" },
  ],
  operator: [
    { to: "/operator", label: "Building Overview", icon: "LayoutDashboard", end: true },
    { to: "/operator/devices", label: "Device Fleet", icon: "Cpu" },
    { to: "/operator/alerts", label: "Alerts", icon: "AlertTriangle" },
    { to: "/operator/maintenance", label: "Maintenance", icon: "Wrench" },
    { to: "/operator/visitors", label: "Visitors", icon: "Users" },
    { to: "/operator/cctv", label: "CCTV", icon: "Camera" },
    { to: "/operator/services", label: "Services", icon: "Briefcase" },
  ],
  developer: [
    { to: "/developer", label: "Portfolio", icon: "LayoutDashboard", end: true },
    { to: "/developer/analytics", label: "Analytics", icon: "BarChart3" },
    { to: "/developer/properties", label: "Properties", icon: "Building2" },
    { to: "/developer/configuration", label: "Configuration", icon: "Settings" },
  ],
};

export const ROLE_LABEL: Record<Role, string> = {
  resident: "Resident",
  operator: "Building Operator",
  developer: "Developer / Owner",
  visitor: "Visitor",
};
