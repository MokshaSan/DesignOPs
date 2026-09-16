// ─────────────────────────────────────────────
//  Core domain types for Smart Living OS
// ─────────────────────────────────────────────

export type Role = 'resident' | 'operator' | 'developer' | 'visitor';
export type ResidentRole = 'owner' | 'occupier' | 'tenant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  residentRole?: ResidentRole;
  unit?: string;
  building?: string;
  avatar?: string;
}

// ─── Device ───────────────────────────────────
export type DeviceType = 'light' | 'ac' | 'curtain' | 'lock' | 'sensor' | 'camera' | 'smoke' | 'energy';
export type DeviceStatus = 'online' | 'offline' | 'warning' | 'error';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  unitId: string;
  buildingId: string;
  floor: number;
  room: string;
  health: number;           // 0–100
  battery?: number;         // 0–100
  lastHeartbeat: string;    // ISO timestamp
  value: DeviceValue;
  telemetry: TelemetryPoint[];
  anomalyCount?: number;
  predictedFailureDays?: number;
}

export interface DeviceValue {
  on?: boolean;
  temperature?: number;
  brightness?: number;        // 0–100
  position?: 'open' | 'closed' | 'partial';
  locked?: boolean;
  co2?: number;
  humidity?: number;
  motion?: boolean;
  smoke?: boolean;
  kwh?: number;
}

export interface TelemetryPoint {
  timestamp: string;
  value: number;
  label?: string;
}

// ─── Scene ────────────────────────────────────
export interface SceneAction {
  deviceId: string;
  deviceType: DeviceType;
  deviceName: string;
  action: Partial<DeviceValue>;
  room: string;
}

export interface Scene {
  id: string;
  name: string;
  icon: string;
  userId: string;
  actions: SceneAction[];
  isActive: boolean;
  createdAt: string;
  aiGenerated?: boolean;
  aiReasoning?: string;
}

// ─── Automation ──────────────────────────────
export type TriggerType = 'time' | 'arrival' | 'departure' | 'sensor' | 'manual';

export interface AutomationTrigger {
  type: TriggerType;
  time?: string;           // "18:00"
  days?: string[];
  sensorId?: string;
  condition?: string;
}

export interface Automation {
  id: string;
  name: string;
  userId: string;
  trigger: AutomationTrigger;
  actions: SceneAction[];
  enabled: boolean;
  lastRun?: string;
  aiSuggested?: boolean;
  confidence?: number;
}

// ─── Visitor ─────────────────────────────────
export type VisitorType = 'guest' | 'delivery' | 'contractor' | 'emergency';
export type AccessPassStatus = 'pending' | 'approved' | 'active' | 'expired' | 'rejected';

export interface VisitorRequest {
  id: string;
  visitorName: string;
  visitorType: VisitorType;
  hostUserId: string;
  unitId: string;
  date: string;
  timeFrom: string;
  timeTo: string;
  status: AccessPassStatus;
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  riskReason: string;
  qrCode?: string;
  createdAt: string;
  scannedAt?: string;
}

// ─── Notification ─────────────────────────────
export type NotifType = 'visitor' | 'energy' | 'maintenance' | 'ai' | 'security' | 'info';

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId: string;
  actionLabel?: string;
  actionRoute?: string;
}

// ─── Energy ───────────────────────────────────
export interface EnergyReading {
  timestamp: string;
  kwh: number;
  label?: string;
}

export interface EnergyBreakdown {
  device: string;
  kwh: number;
  percentage: number;
  color: string;
}

// ─── Building / Property ──────────────────────
export interface Building {
  id: string;
  name: string;
  address: string;
  totalUnits: number;
  onlineDevices: number;
  warningDevices: number;
  offlineDevices: number;
  activeVisitors: number;
  openMaintenance: number;
  energyToday: number;
  deviceUptime: number;
}

export interface Property {
  id: string;
  name: string;
  buildings: Building[];
  totalUnits: number;
  residentEngagement: number;
  energyReduction: number;
  maintenanceReduction: number;
  deviceUptime: number;
}

// ─── Maintenance ──────────────────────────────
export type MaintenancePriority = 'critical' | 'high' | 'medium' | 'low';

export interface MaintenanceRequest {
  id: string;
  deviceId: string;
  deviceName: string;
  unitId: string;
  buildingId: string;
  priority: MaintenancePriority;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  aiPredicted: boolean;
  failureRisk?: number;
  estimatedFailureDays?: number;
}

// ─── AI ───────────────────────────────────────
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AISceneResult {
  name: string;
  icon: string;
  actions: SceneAction[];
  reasoning: string;
  confidence: number;
}
