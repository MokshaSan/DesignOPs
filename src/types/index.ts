export type Role = "resident" | "operator" | "developer" | "visitor";

export type ResidentTier = "owner" | "occupier" | "tenant";

export interface RolePermissions {
  smartHome: boolean;
  access: boolean;
  billing: boolean;
  services: boolean;
  automation: boolean;
}

export interface DeviceReading {
  label: string;
  value: string;
}

export type DeviceKind = "light" | "ac" | "curtain" | "door" | "sensor" | "outlet" | "camera";

export interface Device {
  id: string;
  name: string;
  room: string;
  kind: DeviceKind;
  unitId: string;
  status: "online" | "warning" | "offline";
  power: boolean;
  value?: number; // e.g. temperature / brightness %
  unit?: string; // "°C", "%"
  battery?: number; // 0-100
  health?: number; // 0-100 predictive health score
  lastHeartbeat: string;
  errorCount?: number;
  latencyMs?: number;
}

export interface SceneAction {
  deviceId: string;
  deviceName: string;
  kind: DeviceKind;
  action: string; // human readable e.g. "Dim to 20%"
  power?: boolean;
  value?: number;
}

export interface Scene {
  id: string;
  name: string;
  icon: string; // lucide icon name
  description: string;
  actions: SceneAction[];
  aiGenerated?: boolean;
  aiReasoning?: string;
  lastRun?: string;
}

export interface AutomationCondition {
  type: "time" | "arrival" | "departure" | "occupancy" | "sensor";
  label: string;
}

export interface Automation {
  id: string;
  name: string;
  enabled: boolean;
  trigger: AutomationCondition;
  extraConditions: string[];
  sceneId: string;
  aiSuggested?: boolean;
  confidence?: number;
  lastTriggered?: string;
}

export type VisitorType = "guest" | "delivery" | "contractor" | "service";

export type VisitorStatus = "pending" | "approved" | "rejected" | "checked-in" | "expired";

export interface VisitorRequest {
  id: string;
  name: string;
  type: VisitorType;
  unitId: string;
  hostName?: string;
  destination?: string;
  purpose?: string;
  requestedFor: string;
  windowStart: string;
  windowEnd: string;
  riskLevel: "low" | "medium" | "high";
  riskReason: string;
  status: VisitorStatus;
  passCode: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  icon: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  category: "security" | "energy" | "maintenance" | "ai" | "billing" | "visitor";
}

export type MaintenanceRisk = "low" | "medium" | "high" | "critical";

export interface MaintenanceItem {
  id: string;
  deviceId: string;
  deviceName: string;
  unitId: string;
  risk: MaintenanceRisk;
  reason: string;
  predictedWindow: string;
  status: "predicted" | "scheduled" | "in-progress" | "resolved";
}

export interface AlertItem {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  location: string;
  time: string;
  aiConfidence?: number;
  aiNote?: string;
  acknowledged: boolean;
}

export interface EnergyPoint {
  label: string;
  kwh: number;
}

export interface Unit {
  id: string;
  label: string; // "12A"
  floor: number;
  tower: string;
  residentName: string;
  tier: ResidentTier;
}

export interface Property {
  id: string;
  name: string;
  developer: string;
  units: number;
  uptime: number;
  energyTrend: number;
  engagementScore: number;
}

export type ServiceKind = "cleaning" | "maintenance" | "moving";
export type ServiceRequestStatus = "pending" | "scheduled" | "in-progress" | "completed";

export interface ServiceRequest {
  id: string;
  unitId: string;
  residentName: string;
  kind: ServiceKind;
  requestedAt: string;
  scheduledFor: string;
  notes?: string;
  status: ServiceRequestStatus;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

export type TicketKind = "maintenance" | "complaint";
export type TicketStatus = "open" | "in-progress" | "scheduled" | "resolved";

export interface ServiceTicket {
  id: string;
  kind: TicketKind;
  category: string;
  title: string;
  detail: string;
  unitId: string;
  residentName: string;
  createdAt: string;
  status: TicketStatus;
  priority: "low" | "medium" | "high";
}

export interface Invoice {
  id: string;
  period: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: "paid" | "due" | "overdue";
  method?: string;
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  category: "event" | "outage" | "policy" | "holiday";
  postedAt: string;
  author: string;
}

export interface FacilityBooking {
  id: string;
  facilityId: string;
  facilityName: string;
  date: string;
  slot: string;
  unitId: string;
  residentName: string;
  status: "confirmed" | "cancelled";
}

export interface FloorPlanUnit {
  id: string;
  levelCode: string;
  label: string;
  occupied: boolean;
  residentName: string;
  tier: ResidentTier;
  devices: number;
}

export interface FloorPlanAmenity {
  id: string;
  name: string;
  levelCode: string;
  hours: string;
  status: "open" | "maintenance" | "closed";
}
