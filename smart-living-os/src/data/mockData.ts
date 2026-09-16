import type {
  User, Device, Scene, Automation, VisitorRequest,
  Notification, Building, Property, MaintenanceRequest,
  EnergyReading, EnergyBreakdown
} from '../types';

// ─── Users ────────────────────────────────────
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex Perera', email: 'alex@jkx.lk', role: 'resident', residentRole: 'owner', unit: '12A', building: 'The Grand Residences', avatar: 'AP' },
  { id: 'u2', name: 'Sam Fernando', email: 'sam@jkx.lk', role: 'resident', residentRole: 'tenant', unit: '8B', building: 'The Grand Residences', avatar: 'SF' },
  { id: 'u3', name: 'Priya Raj', email: 'priya@jkx.lk', role: 'operator', building: 'The Grand Residences', avatar: 'PR' },
  { id: 'u4', name: 'Rajan Wickrama', email: 'rajan@jkx.lk', role: 'developer', avatar: 'RW' },
  { id: 'u5', name: 'John Perera', email: 'john@gmail.com', role: 'visitor', avatar: 'JP' },
];

// ─── Devices ──────────────────────────────────
export const MOCK_DEVICES: Device[] = [
  {
    id: 'd1', name: 'Living Room Light', type: 'light', status: 'online',
    unitId: '12A', buildingId: 'b1', floor: 12, room: 'Living Room', health: 96, battery: undefined,
    lastHeartbeat: new Date().toISOString(),
    value: { on: true, brightness: 70 },
    telemetry: generateTelemetry(70, 10),
  },
  {
    id: 'd2', name: 'Bedroom Light', type: 'light', status: 'online',
    unitId: '12A', buildingId: 'b1', floor: 12, room: 'Bedroom', health: 92,
    lastHeartbeat: new Date().toISOString(),
    value: { on: false, brightness: 0 },
    telemetry: generateTelemetry(0, 10),
  },
  {
    id: 'd3', name: 'Living Room AC', type: 'ac', status: 'online',
    unitId: '12A', buildingId: 'b1', floor: 12, room: 'Living Room', health: 88,
    lastHeartbeat: new Date().toISOString(),
    value: { on: true, temperature: 24 },
    telemetry: generateTelemetry(24, 2),
  },
  {
    id: 'd4', name: 'Front Door Lock', type: 'lock', status: 'online',
    unitId: '12A', buildingId: 'b1', floor: 12, room: 'Entrance', health: 98,
    lastHeartbeat: new Date().toISOString(),
    value: { locked: true },
    telemetry: [],
  },
  {
    id: 'd5', name: 'Living Room Curtain', type: 'curtain', status: 'online',
    unitId: '12A', buildingId: 'b1', floor: 12, room: 'Living Room', health: 91,
    lastHeartbeat: new Date().toISOString(),
    value: { position: 'open' },
    telemetry: [],
  },
  {
    id: 'd6', name: 'Energy Monitor', type: 'energy', status: 'online',
    unitId: '12A', buildingId: 'b1', floor: 12, room: 'Utility', health: 99,
    lastHeartbeat: new Date().toISOString(),
    value: { kwh: 4.2 },
    telemetry: generateTelemetry(4.2, 0.5),
  },
  // Warning device – used for operator demo
  {
    id: 'd7', name: 'Temperature Sensor 12A', type: 'sensor', status: 'warning',
    unitId: '12A', buildingId: 'b1', floor: 12, room: 'Bedroom', health: 62, battery: 18,
    lastHeartbeat: new Date(Date.now() - 300000).toISOString(),
    value: { co2: 980, humidity: 72 },
    telemetry: generateTelemetry(60, 10),
    anomalyCount: 14,
    predictedFailureDays: 7,
  },
  // Offline device
  {
    id: 'd8', name: 'Smoke Sensor 14F', type: 'smoke', status: 'error',
    unitId: '14F', buildingId: 'b1', floor: 14, room: 'Kitchen', health: 22, battery: 5,
    lastHeartbeat: new Date(Date.now() - 3600000).toISOString(),
    value: { smoke: false },
    telemetry: generateTelemetry(20, 5),
    anomalyCount: 3,
    predictedFailureDays: 2,
  },
];

function generateTelemetry(base: number, variance: number, points = 24) {
  return Array.from({ length: points }, (_, i) => ({
    timestamp: new Date(Date.now() - (points - i) * 3600000).toISOString(),
    value: base + (Math.random() - 0.5) * variance * 2,
    label: `${i}h ago`,
  }));
}

// ─── Scenes ───────────────────────────────────
export const MOCK_SCENES: Scene[] = [
  {
    id: 's1', name: 'Good Morning', icon: '☀️', userId: 'u1', isActive: false, createdAt: '2026-09-01T06:00:00Z',
    actions: [
      { deviceId: 'd1', deviceType: 'light', deviceName: 'Living Room Light', action: { on: true, brightness: 100 }, room: 'Living Room' },
      { deviceId: 'd3', deviceType: 'ac', deviceName: 'Living Room AC', action: { on: true, temperature: 22 }, room: 'Living Room' },
      { deviceId: 'd5', deviceType: 'curtain', deviceName: 'Living Room Curtain', action: { position: 'open' }, room: 'Living Room' },
    ],
  },
  {
    id: 's2', name: 'Leaving Home', icon: '🏠', userId: 'u1', isActive: false, createdAt: '2026-09-01T08:00:00Z',
    actions: [
      { deviceId: 'd1', deviceType: 'light', deviceName: 'Living Room Light', action: { on: false }, room: 'Living Room' },
      { deviceId: 'd2', deviceType: 'light', deviceName: 'Bedroom Light', action: { on: false }, room: 'Bedroom' },
      { deviceId: 'd3', deviceType: 'ac', deviceName: 'Living Room AC', action: { on: false }, room: 'Living Room' },
      { deviceId: 'd4', deviceType: 'lock', deviceName: 'Front Door Lock', action: { locked: true }, room: 'Entrance' },
      { deviceId: 'd5', deviceType: 'curtain', deviceName: 'Living Room Curtain', action: { position: 'closed' }, room: 'Living Room' },
    ],
  },
  {
    id: 's3', name: 'Movie Time', icon: '🎬', userId: 'u1', isActive: false, createdAt: '2026-09-02T19:00:00Z',
    actions: [
      { deviceId: 'd1', deviceType: 'light', deviceName: 'Living Room Light', action: { on: true, brightness: 20 }, room: 'Living Room' },
      { deviceId: 'd3', deviceType: 'ac', deviceName: 'Living Room AC', action: { on: true, temperature: 23 }, room: 'Living Room' },
      { deviceId: 'd5', deviceType: 'curtain', deviceName: 'Living Room Curtain', action: { position: 'closed' }, room: 'Living Room' },
    ],
    aiGenerated: true,
    aiReasoning: 'Dim lights create the ideal cinema ambience. AC at 23°C keeps you comfortable without noise distraction.',
  },
  {
    id: 's4', name: 'Sleep Mode', icon: '🌙', userId: 'u1', isActive: true, createdAt: '2026-09-01T23:00:00Z',
    actions: [
      { deviceId: 'd1', deviceType: 'light', deviceName: 'Living Room Light', action: { on: false }, room: 'Living Room' },
      { deviceId: 'd2', deviceType: 'light', deviceName: 'Bedroom Light', action: { on: false }, room: 'Bedroom' },
      { deviceId: 'd3', deviceType: 'ac', deviceName: 'Living Room AC', action: { on: true, temperature: 25 }, room: 'Living Room' },
      { deviceId: 'd4', deviceType: 'lock', deviceName: 'Front Door Lock', action: { locked: true }, room: 'Entrance' },
      { deviceId: 'd5', deviceType: 'curtain', deviceName: 'Living Room Curtain', action: { position: 'closed' }, room: 'Living Room' },
    ],
  },
  {
    id: 's5', name: 'Evening Arrival', icon: '✨', userId: 'u1', isActive: false, createdAt: '2026-09-10T18:00:00Z',
    actions: [
      { deviceId: 'd1', deviceType: 'light', deviceName: 'Living Room Light', action: { on: true, brightness: 80 }, room: 'Living Room' },
      { deviceId: 'd3', deviceType: 'ac', deviceName: 'Living Room AC', action: { on: true, temperature: 24 }, room: 'Living Room' },
      { deviceId: 'd4', deviceType: 'lock', deviceName: 'Front Door Lock', action: { locked: false }, room: 'Entrance' },
      { deviceId: 'd5', deviceType: 'curtain', deviceName: 'Living Room Curtain', action: { position: 'open' }, room: 'Living Room' },
    ],
    aiGenerated: true,
    aiReasoning: 'Based on your arrival pattern between 18:00–19:00, I pre-warm your space and unlock the door as you approach.',
  },
];

// ─── Automations ──────────────────────────────
export const MOCK_AUTOMATIONS: Automation[] = [
  {
    id: 'a1', name: 'Evening Arrival', userId: 'u1', enabled: true,
    trigger: { type: 'arrival', time: '18:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    actions: MOCK_SCENES.find(s => s.id === 's5')!.actions,
    lastRun: new Date(Date.now() - 3600000 * 2).toISOString(),
    aiSuggested: true,
    confidence: 94,
  },
  {
    id: 'a2', name: 'Energy Saver', userId: 'u1', enabled: true,
    trigger: { type: 'sensor', condition: 'No occupancy for 30 minutes' },
    actions: [
      { deviceId: 'd1', deviceType: 'light', deviceName: 'Living Room Light', action: { on: false }, room: 'Living Room' },
      { deviceId: 'd3', deviceType: 'ac', deviceName: 'Living Room AC', action: { temperature: 27 }, room: 'Living Room' },
    ],
    lastRun: new Date(Date.now() - 3600000 * 5).toISOString(),
    aiSuggested: true,
    confidence: 88,
  },
  {
    id: 'a3', name: 'Sleep Mode', userId: 'u1', enabled: true,
    trigger: { type: 'time', time: '23:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    actions: MOCK_SCENES.find(s => s.id === 's4')!.actions,
    lastRun: new Date(Date.now() - 3600000 * 14).toISOString(),
  },
];

// ─── Visitors ──────────────────────────────────
const now = new Date();
export const MOCK_VISITORS: VisitorRequest[] = [
  {
    id: 'v1', visitorName: 'John Perera', visitorType: 'delivery', hostUserId: 'u1',
    unitId: '12A', date: now.toISOString().split('T')[0],
    timeFrom: '18:00', timeTo: '18:30', status: 'pending',
    riskScore: 'LOW', riskReason: 'Known delivery provider. Single-use access. 30-minute window.',
    createdAt: new Date(Date.now() - 300000).toISOString(),
    qrCode: 'JK-PASS-V1-20260916',
  },
  {
    id: 'v2', visitorName: 'ABC Maintenance', visitorType: 'contractor', hostUserId: 'u3',
    unitId: '18B', date: now.toISOString().split('T')[0],
    timeFrom: '17:00', timeTo: '19:00', status: 'approved',
    riskScore: 'LOW', riskReason: 'Registered contractor. Background verified.',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    qrCode: 'JK-PASS-V2-20260916',
  },
  {
    id: 'v3', visitorName: 'Sarah Nimal', visitorType: 'guest', hostUserId: 'u1',
    unitId: '12A', date: now.toISOString().split('T')[0],
    timeFrom: '20:00', timeTo: '22:00', status: 'approved',
    riskScore: 'LOW', riskReason: 'Invited guest. Pre-approved by resident.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    qrCode: 'JK-PASS-V3-20260916',
  },
];

// ─── Notifications ────────────────────────────
export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'visitor', title: 'Visitor Request', message: 'John Perera (Delivery) is requesting access to 12A from 18:00–18:30.', timestamp: new Date(Date.now() - 300000).toISOString(), read: false, userId: 'u1', actionLabel: 'Review', actionRoute: '/resident/visitors' },
  { id: 'n2', type: 'ai', title: 'New Automation Suggestion', message: 'I noticed you turn on the AC and lights every weekday around 7:00 AM. Create a "Morning Routine" automation?', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false, userId: 'u1', actionLabel: 'Create', actionRoute: '/resident/automation' },
  { id: 'n3', type: 'energy', title: 'Energy Spike Detected', message: 'Your AC has been running for 6 hours. Consider raising the setpoint by 1°C to save ~0.8 kWh.', timestamp: new Date(Date.now() - 7200000).toISOString(), read: true, userId: 'u1', actionLabel: 'View Energy', actionRoute: '/resident/energy' },
  { id: 'n4', type: 'maintenance', title: 'AC Filter Maintenance', message: 'Your Living Room AC filter is due for maintenance. Schedule a service appointment.', timestamp: new Date(Date.now() - 86400000).toISOString(), read: true, userId: 'u1', actionLabel: 'Schedule', actionRoute: '/resident/notifications' },
  { id: 'n5', type: 'security', title: 'Door Unlocked', message: 'Front door was unlocked at 18:24 — Evening Arrival automation triggered.', timestamp: new Date(Date.now() - 7200000).toISOString(), read: true, userId: 'u1' },
];

// ─── Energy Data ───────────────────────────────
export const MOCK_ENERGY_HOURLY: EnergyReading[] = Array.from({ length: 24 }, (_, i) => ({
  timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
  kwh: 0.1 + Math.random() * 0.5 + (i > 7 && i < 22 ? 0.3 : 0),
  label: `${i}:00`,
}));

export const MOCK_ENERGY_WEEKLY: EnergyReading[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => ({
  timestamp: new Date(Date.now() - (6 - i) * 86400000).toISOString(),
  kwh: 3.8 + Math.random() * 2,
  label: day,
}));

export const MOCK_ENERGY_BREAKDOWN: EnergyBreakdown[] = [
  { device: 'Air Conditioning', kwh: 2.01, percentage: 48, color: '#7c3aed' },
  { device: 'Lighting', kwh: 0.63, percentage: 15, color: '#a78bfa' },
  { device: 'Appliances', kwh: 0.84, percentage: 20, color: '#c4b5fd' },
  { device: 'Other', kwh: 0.72, percentage: 17, color: '#ddd6fe' },
];

// ─── Building ─────────────────────────────────
export const MOCK_BUILDINGS: Building[] = [
  { id: 'b1', name: 'The Grand Residences', address: '1, Union Place, Colombo 02', totalUnits: 384, onlineDevices: 361, warningDevices: 18, offlineDevices: 5, activeVisitors: 27, openMaintenance: 12, energyToday: 2481, deviceUptime: 96 },
  { id: 'b2', name: 'Ocean Heights', address: '14, Marine Drive, Colombo 03', totalUnits: 420, onlineDevices: 398, warningDevices: 15, offlineDevices: 7, activeVisitors: 31, openMaintenance: 8, energyToday: 2890, deviceUptime: 91 },
];

export const MOCK_PROPERTY: Property = {
  id: 'p1', name: 'JK Smart Living Portfolio',
  buildings: MOCK_BUILDINGS, totalUnits: 4820,
  residentEngagement: 91, energyReduction: 14,
  maintenanceReduction: 21, deviceUptime: 98,
};

// ─── Maintenance ──────────────────────────────
export const MOCK_MAINTENANCE: MaintenanceRequest[] = [
  { id: 'm1', deviceId: 'd3', deviceName: 'AC Unit 12A', unitId: '12A', buildingId: 'b1', priority: 'high', description: 'Predictive AI detected increasing power draw and reduced cooling efficiency. Filter replacement recommended.', status: 'open', createdAt: new Date(Date.now() - 86400000).toISOString(), aiPredicted: true, failureRisk: 78, estimatedFailureDays: 5 },
  { id: 'm2', deviceId: 'd7', deviceName: 'Door Sensor 8F', unitId: '8F', buildingId: 'b1', priority: 'medium', description: 'Sensor reporting intermittent failures. Battery at 18%.', status: 'open', createdAt: new Date(Date.now() - 172800000).toISOString(), aiPredicted: true, failureRisk: 62, estimatedFailureDays: 7 },
  { id: 'm3', deviceId: 'd8', deviceName: 'Smoke Sensor 14F', unitId: '14F', buildingId: 'b1', priority: 'critical', description: 'Smoke sensor offline. Immediate inspection required.', status: 'in_progress', createdAt: new Date(Date.now() - 7200000).toISOString(), aiPredicted: false, failureRisk: 95, estimatedFailureDays: 0 },
];

// ─── Activity Log ────────────────────────────
export const MOCK_ACTIVITY = [
  { id: 'act1', time: '18:26', message: 'Lights turned on (Evening Arrival)', icon: '💡' },
  { id: 'act2', time: '18:25', message: 'AC set to 24°C (Evening Arrival)', icon: '❄️' },
  { id: 'act3', time: '18:24', message: 'Evening Arrival automation activated', icon: '✨' },
  { id: 'act4', time: '18:24', message: 'Front door unlocked', icon: '🚪' },
  { id: 'act5', time: '15:12', message: 'Energy Saver triggered — no occupancy', icon: '⚡' },
  { id: 'act6', time: '08:05', message: 'Good Morning scene activated', icon: '☀️' },
];

// ─── Building Floor Map ────────────────────────
export const BUILDING_MAP = {
  name: 'The Grand Residences',
  address: '1, Union Place, Colombo 02',
  floors: 24,
  units_per_floor: 8,
  amenities: [
    { floor: 1, name: 'Main Lobby', description: 'Main entrance, security desk, concierge, mailroom', direction: 'Ground floor, main entrance facing Union Place' },
    { floor: 1, name: 'Car Park Entrance', description: 'Basement 1 & 2 parking, EV charging stations', direction: 'Ground floor, right wing, ramp to B1' },
    { floor: 2, name: 'Gym & Fitness Center', description: 'Full gym, treadmills, free weights, yoga studio', direction: '2nd floor, take elevator to Level 2, turn right' },
    { floor: 2, name: 'Swimming Pool', description: 'Olympic lap pool and leisure pool, changing rooms', direction: '2nd floor, take elevator to Level 2, turn left toward poolside' },
    { floor: 3, name: 'Rooftop Lounge & BBQ', description: 'BBQ stations, outdoor seating, city views', direction: '3rd floor, elevator to Level 3, outdoor terrace' },
    { floor: 3, name: 'Kids Play Area', description: 'Indoor and outdoor play zones for children', direction: '3rd floor, elevator to Level 3, east wing' },
    { floor: 4, name: 'Business Centre', description: 'Co-working spaces, meeting rooms, high-speed WiFi', direction: '4th floor, elevator to Level 4, turn left' },
    { floor: 4, name: 'Residents Lounge', description: 'Social lounge, reading area, coffee bar', direction: '4th floor, elevator to Level 4, central area' },
    { floor: 5, name: 'Spa & Wellness', description: 'Sauna, steam room, massage therapy', direction: '5th floor, elevator to Level 5, turn right' },
    { floor: 1, name: 'Supermarket (FoodCity)', description: 'Grocery store, 7 days 7AM–10PM', direction: 'Ground floor, south wing, separate entrance on Union Place' },
    { floor: 1, name: 'Pharmacy', description: 'Keells Pharmacy, 8AM–9PM daily', direction: 'Ground floor, east wing next to lobby' },
    { floor: 5, name: 'Sky Deck', description: 'Observation deck with panoramic Colombo views', direction: '5th floor, take elevator to Level 5, follow Sky Deck signs north' },
  ],
  units: [
    { floor: 12, unit: '12A', type: 'Penthouse', bedrooms: 3, sqft: 2200 },
    { floor: 8, unit: '8B', type: '2BR', bedrooms: 2, sqft: 1100 },
  ],
};
