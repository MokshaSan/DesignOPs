import {
  LayoutDashboard,
  Sparkles,
  Workflow,
  Zap,
  Fingerprint,
  Users,
  Bell,
  UserCircle,
  Cpu,
  AlertTriangle,
  Wrench,
  Briefcase,
  BarChart3,
  Building2,
  Settings,
  Sunrise,
  LogOut,
  Clapperboard,
  Moon,
  Lightbulb,
  Thermometer,
  Blinds,
  DoorClosed,
  Radio,
  Plug,
  Camera,
  ShieldCheck,
  ShieldAlert,
  QrCode,
  MapPin,
  Bot,
  CalendarClock,
  Megaphone,
  CreditCard,
  MessageSquareWarning,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  Sparkles,
  Workflow,
  Zap,
  Fingerprint,
  Users,
  Bell,
  UserCircle,
  Cpu,
  AlertTriangle,
  Wrench,
  Briefcase,
  BarChart3,
  Building2,
  Settings,
  Sunrise,
  LogOut,
  Clapperboard,
  Moon,
  Lightbulb,
  Thermometer,
  Blinds,
  DoorClosed,
  Radio,
  Plug,
  Camera,
  ShieldCheck,
  ShieldAlert,
  QrCode,
  MapPin,
  Bot,
  CalendarClock,
  Megaphone,
  CreditCard,
  MessageSquareWarning,
  LayoutGrid,
};

export function getIcon(name: string): LucideIcon {
  return ICONS[name] ?? Sparkles;
}

export function deviceIcon(kind: string): LucideIcon {
  switch (kind) {
    case "light":
      return Lightbulb;
    case "ac":
      return Thermometer;
    case "curtain":
      return Blinds;
    case "door":
      return DoorClosed;
    case "sensor":
      return Radio;
    case "outlet":
      return Plug;
    case "camera":
      return Camera;
    default:
      return Cpu;
  }
}
