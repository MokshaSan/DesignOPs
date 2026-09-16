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
  requestedFor: string; // ISO date
  windowStart: string; // HH:mm
  windowEnd: string; // HH:mm
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

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
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
