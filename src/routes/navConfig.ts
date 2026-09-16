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
    { to: "/resident/devices", label: "Devices", icon: "Cpu" },
    { to: "/resident/scenes", label: "Scenes", icon: "Sparkles" },
    { to: "/resident/automation", label: "Automation", icon: "Workflow" },
    { to: "/resident/energy", label: "Energy", icon: "Zap" },
    { to: "/resident/access", label: "Access", icon: "Fingerprint" },
    { to: "/resident/visitors", label: "Visitors", icon: "Users" },
    { to: "/resident/maintenance", label: "Maintenance", icon: "Wrench" },
    { to: "/resident/complaints", label: "Complaints", icon: "MessageSquareWarning" },
    { to: "/resident/payments", label: "Payments", icon: "CreditCard" },
    { to: "/resident/community", label: "Community", icon: "Megaphone" },
    { to: "/resident/bookings", label: "Bookings", icon: "CalendarClock" },
    { to: "/resident/facilities", label: "Facilities", icon: "MapPin" },
    { to: "/resident/notifications", label: "Notifications", icon: "Bell" },
    { to: "/resident/system", label: "How Nestura works", icon: "Info" },
    { to: "/resident/profile", label: "Profile", icon: "UserCircle" },
  ],
  operator: [
    { to: "/operator", label: "Building Overview", icon: "LayoutDashboard", end: true },
    { to: "/operator/devices", label: "Device Fleet", icon: "Cpu" },
    { to: "/operator/alerts", label: "Alerts", icon: "AlertTriangle" },
    { to: "/operator/maintenance", label: "Work queue", icon: "Wrench" },
    { to: "/operator/visitors", label: "Visitors", icon: "Users" },
    { to: "/operator/bookings", label: "Facilities", icon: "CalendarClock" },
    { to: "/operator/community", label: "Notices", icon: "Megaphone" },
    { to: "/operator/cctv", label: "CCTV", icon: "Camera" },
    { to: "/operator/floor-plan", label: "Floor Plan", icon: "LayoutGrid" },
    { to: "/operator/services", label: "Services", icon: "Briefcase" },
    { to: "/operator/payments", label: "Payments", icon: "CreditCard" },
    { to: "/operator/system", label: "How Nestura works", icon: "Info" },
  ],
  developer: [
    { to: "/developer", label: "Portfolio", icon: "LayoutDashboard", end: true },
    { to: "/developer/analytics", label: "Analytics", icon: "BarChart3" },
    { to: "/developer/properties", label: "Properties", icon: "Building2" },
    { to: "/developer/collections", label: "Collections", icon: "CreditCard" },
    { to: "/developer/configuration", label: "Configuration", icon: "Settings" },
    { to: "/developer/system", label: "How Nestura works", icon: "Info" },
  ],
};

export const ROLE_LABEL: Record<Role, string> = {
  resident: "Resident",
  operator: "Building Operator",
  developer: "Developer / Owner",
  visitor: "Visitor",
};
