import type {
  AlertItem,
  AppNotification,
  Automation,
  Device,
  EnergyPoint,
  FacilityBooking,
  FloorPlanAmenity,
  FloorPlanUnit,
  Invoice,
  MaintenanceItem,
  Notice,
  Property,
  ResidentTier,
  Scene,
  ServiceRequest,
  ServiceTicket,
  Unit,
  VisitorRequest,
} from "@/types";

export const CURRENT_UNIT: Unit = {
  id: "12A",
  label: "12A",
  floor: 12,
  tower: "Tower A",
  residentName: "Alex Perera",
  tier: "owner",
};

export const SEED_DEVICES: Device[] = [
  { id: "light-lr", name: "Living Room Lights", room: "Living Room", kind: "light", unitId: "12A", status: "online", power: true, value: 80, unit: "%", health: 96, lastHeartbeat: "just now" },
  { id: "light-br", name: "Bedroom Lights", room: "Bedroom", kind: "light", unitId: "12A", status: "online", power: false, value: 0, unit: "%", health: 98, lastHeartbeat: "1m ago" },
  { id: "light-kitchen", name: "Kitchen Lights", room: "Kitchen", kind: "light", unitId: "12A", status: "online", power: true, value: 60, unit: "%", health: 99, lastHeartbeat: "just now" },
  { id: "ac-lr", name: "Living Room AC", room: "Living Room", kind: "ac", unitId: "12A", status: "online", power: true, value: 24, unit: "°C", health: 92, lastHeartbeat: "just now" },
  { id: "ac-br", name: "Bedroom AC", room: "Bedroom", kind: "ac", unitId: "12A", status: "online", power: false, value: 26, unit: "°C", health: 88, lastHeartbeat: "2m ago" },
  { id: "curtain-lr", name: "Living Room Curtains", room: "Living Room", kind: "curtain", unitId: "12A", status: "online", power: true, value: 100, unit: "%", health: 100, lastHeartbeat: "just now" },
  { id: "door-front", name: "Front Door", room: "Entrance", kind: "door", unitId: "12A", status: "online", power: true, health: 97, lastHeartbeat: "just now" },
  { id: "sensor-temp", name: "Living Room Sensor", room: "Living Room", kind: "sensor", unitId: "12A", status: "warning", power: true, value: 62, unit: "%", health: 62, battery: 18, errorCount: 4, latencyMs: 820, lastHeartbeat: "09:42" },
  { id: "outlet-tv", name: "TV & Media Outlet", room: "Living Room", kind: "outlet", unitId: "12A", status: "online", power: false, health: 100, lastHeartbeat: "just now" },
  // Building fleet — other units, for the Operator's device fleet view
  { id: "door-8f", name: "Door Sensor", room: "Entrance", kind: "sensor", unitId: "8F", status: "warning", power: true, health: 58, battery: 22, errorCount: 5, latencyMs: 940, lastHeartbeat: "12m ago" },
  { id: "sensor-4c", name: "Temperature Sensor", room: "Living Room", kind: "sensor", unitId: "4C", status: "warning", power: true, health: 71, battery: 44, errorCount: 2, latencyMs: 410, lastHeartbeat: "5m ago" },
  { id: "ac-18b", name: "AC Unit", room: "Living Room", kind: "ac", unitId: "18B", status: "online", power: true, value: 23, unit: "°C", health: 92, lastHeartbeat: "1m ago" },
  { id: "light-3c", name: "Living Room Lights", room: "Living Room", kind: "light", unitId: "3C", status: "online", power: true, value: 90, unit: "%", health: 99, lastHeartbeat: "just now" },
  { id: "lock-9d", name: "Front Door Lock", room: "Entrance", kind: "door", unitId: "9D", status: "online", power: true, health: 98, lastHeartbeat: "just now" },
  { id: "smoke-14f", name: "Smoke Sensor", room: "Corridor", kind: "sensor", unitId: "14F", status: "warning", power: true, health: 65, battery: 76, errorCount: 1, latencyMs: 300, lastHeartbeat: "4m ago" },
];

export const SEED_SCENES: Scene[] = [
  {
    id: "scene-morning",
    name: "Good Morning",
    icon: "Sunrise",
    description: "Gentle wake-up lighting, curtains open, AC to comfort temp.",
    actions: [
      { deviceId: "curtain-lr", deviceName: "Living Room Curtains", kind: "curtain", action: "Open", power: true },
      { deviceId: "light-kitchen", deviceName: "Kitchen Lights", kind: "light", action: "On at 70%", power: true, value: 70 },
      { deviceId: "ac-br", deviceName: "Bedroom AC", kind: "ac", action: "Set to 25°C", power: true, value: 25 },
    ],
    lastRun: "Today, 6:32 AM",
  },
  {
    id: "scene-leaving",
    name: "Leaving Home",
    icon: "LogOut",
    description: "Turns everything off and locks up.",
    actions: [
      { deviceId: "light-lr", deviceName: "Living Room Lights", kind: "light", action: "Off", power: false },
      { deviceId: "light-kitchen", deviceName: "Kitchen Lights", kind: "light", action: "Off", power: false },
      { deviceId: "ac-lr", deviceName: "Living Room AC", kind: "ac", action: "Off", power: false },
      { deviceId: "door-front", deviceName: "Front Door", kind: "door", action: "Lock", power: true },
    ],
    lastRun: "Yesterday, 8:14 AM",
  },
  {
    id: "scene-movie",
    name: "Movie Time",
    icon: "Clapperboard",
    description: "Dim lights, close curtains, TV on, comfortable temp.",
    actions: [
      { deviceId: "light-lr", deviceName: "Living Room Lights", kind: "light", action: "Dim to 20%", power: true, value: 20 },
      { deviceId: "curtain-lr", deviceName: "Living Room Curtains", kind: "curtain", action: "Close", power: false },
      { deviceId: "ac-lr", deviceName: "Living Room AC", kind: "ac", action: "Set to 23°C", power: true, value: 23 },
      { deviceId: "outlet-tv", deviceName: "TV & Media Outlet", kind: "outlet", action: "On", power: true },
    ],
    lastRun: "3 days ago",
  },
  {
    id: "scene-sleep",
    name: "Sleep Mode",
    icon: "Moon",
    description: "All lights off, AC to sleep temp, curtains closed, door locked.",
    actions: [
      { deviceId: "light-lr", deviceName: "Living Room Lights", kind: "light", action: "Off", power: false },
      { deviceId: "light-br", deviceName: "Bedroom Lights", kind: "light", action: "Off", power: false },
      { deviceId: "curtain-lr", deviceName: "Living Room Curtains", kind: "curtain", action: "Close", power: false },
      { deviceId: "ac-br", deviceName: "Bedroom AC", kind: "ac", action: "Set to 24°C", power: true, value: 24 },
      { deviceId: "door-front", deviceName: "Front Door", kind: "door", action: "Lock", power: true },
    ],
    lastRun: "Last night, 11:04 PM",
  },
  {
    id: "scene-arrival",
    name: "Evening Arrival",
    icon: "Sparkles",
    description: "AI-suggested: lights, AC and curtains ready right as you walk in.",
    actions: [
      { deviceId: "door-front", deviceName: "Front Door", kind: "door", action: "Unlock", power: false },
      { deviceId: "light-lr", deviceName: "Living Room Lights", kind: "light", action: "On at 80%", power: true, value: 80 },
      { deviceId: "ac-lr", deviceName: "Living Room AC", kind: "ac", action: "Set to 24°C", power: true, value: 24 },
      { deviceId: "curtain-lr", deviceName: "Living Room Curtains", kind: "curtain", action: "Open", power: true },
    ],
    aiGenerated: true,
    aiReasoning: "You typically arrive home between 6:00–6:30 PM and manually turn on the living room lights and AC within 3 minutes of unlocking the door.",
  },
];

export const SEED_AUTOMATIONS: Automation[] = [
  {
    id: "auto-arrival",
    name: "Evening Arrival",
    enabled: true,
    trigger: { type: "arrival", label: "Resident arrives home" },
    extraConditions: ["Time is between 18:00–19:00"],
    sceneId: "scene-arrival",
    aiSuggested: true,
    confidence: 91,
    lastTriggered: "Yesterday, 18:12",
  },
  {
    id: "auto-energy-saver",
    name: "Energy Saver",
    enabled: true,
    trigger: { type: "occupancy", label: "No occupancy detected for 30 minutes" },
    extraConditions: ["AC setpoint raised by 1°C"],
    sceneId: "scene-leaving",
    lastTriggered: "2 days ago",
  },
  {
    id: "auto-sleep",
    name: "Sleep Mode",
    enabled: true,
    trigger: { type: "time", label: "23:00 every day" },
    extraConditions: [],
    sceneId: "scene-sleep",
    lastTriggered: "Last night, 23:00",
  },
];

export const SEED_VISITORS: VisitorRequest[] = [
  {
    id: "visitor-1",
    name: "John Fernando",
    type: "delivery",
    unitId: "12A",
    hostName: "John Perera",
    destination: "Tower A · Unit 12A",
    purpose: "Parcel delivery",
    requestedFor: "Today",
    windowStart: "18:00",
    windowEnd: "18:30",
    riskLevel: "low",
    riskReason: "Known delivery provider · single-use access · 30-minute window",
    status: "pending",
    passCode: "JK-4821",
    createdAt: "17:42",
  },
  {
    id: "visitor-2",
    name: "ABC Maintenance Co.",
    type: "contractor",
    unitId: "18B",
    hostName: "Saman Liyanage",
    destination: "Tower A · Unit 18B",
    purpose: "Scheduled maintenance",
    requestedFor: "Today",
    windowStart: "17:00",
    windowEnd: "19:00",
    riskLevel: "medium",
    riskReason: "First-time contractor · extended 2-hour window",
    status: "approved",
    passCode: "JK-7790",
    createdAt: "16:05",
  },
];

export const SEED_NOTIFICATIONS: AppNotification[] = [
  { id: "n1", icon: "ShieldCheck", title: "Visitor access granted", body: "John Fernando approved for 18:00–18:30", time: "2m ago", read: false, category: "visitor" },
  { id: "n2", icon: "Zap", title: "Energy consumption increased", body: "Today's usage is 18% above your weekly average", time: "1h ago", read: false, category: "energy" },
  { id: "n3", icon: "Wrench", title: "Sensor maintenance recommended", body: "Living Room sensor battery at 18% with rising error rate", time: "3h ago", read: true, category: "maintenance" },
  { id: "n4", icon: "Sparkles", title: "New automation suggestion", body: "AI noticed a pattern for weekday evenings", time: "Yesterday", read: true, category: "ai" },
];

export const SEED_MAINTENANCE: MaintenanceItem[] = [
  { id: "m1", deviceId: "sensor-temp", deviceName: "Living Room Sensor — 12A", unitId: "12A", risk: "high", reason: "Rising response latency + declining battery + repeated sensor errors", predictedWindow: "Within 7 days", status: "predicted" },
  { id: "m2", deviceId: "ac-lr", deviceName: "AC Unit — 12A", unitId: "12A", risk: "medium", reason: "Compressor cycle frequency 22% above baseline", predictedWindow: "Within 21 days", status: "predicted" },
  { id: "m3", deviceId: "door-8f", deviceName: "Door Sensor — 8F", unitId: "8F", risk: "medium", reason: "Intermittent connectivity drops", predictedWindow: "Within 14 days", status: "scheduled" },
  { id: "m4", deviceId: "sensor-4c", deviceName: "Temperature Sensor — 4C", unitId: "4C", risk: "low", reason: "Minor calibration drift", predictedWindow: "Within 30 days", status: "predicted" },
];

export const SEED_ALERTS: AlertItem[] = [
  {
    id: "a1",
    severity: "critical",
    title: "Smoke sensor spike",
    location: "Tower A · Floor 14",
    time: "4m ago",
    aiConfidence: 78,
    aiNote: "Single-sensor spike with no matching event on nearby sensors. Recommend verification before building-wide escalation.",
    acknowledged: false,
  },
  {
    id: "a2",
    severity: "warning",
    title: "Temperature sensor drifting",
    location: "Unit 12A",
    time: "22m ago",
    aiConfidence: 84,
    aiNote: "Battery and latency trend indicate failure risk within 7 days.",
    acknowledged: false,
  },
  {
    id: "a3",
    severity: "info",
    title: "AC filter maintenance due",
    location: "8 units · Tower A",
    time: "2h ago",
    acknowledged: true,
  },
];

export const ENERGY_TODAY: EnergyPoint[] = [
  { label: "6AM", kwh: 0.4 }, { label: "8AM", kwh: 0.9 }, { label: "10AM", kwh: 0.6 },
  { label: "12PM", kwh: 0.8 }, { label: "2PM", kwh: 1.1 }, { label: "4PM", kwh: 0.7 },
  { label: "6PM", kwh: 1.6 }, { label: "8PM", kwh: 2.1 }, { label: "10PM", kwh: 1.3 },
];

export const ENERGY_WEEK: EnergyPoint[] = [
  { label: "Mon", kwh: 4.8 }, { label: "Tue", kwh: 5.1 }, { label: "Wed", kwh: 4.3 },
  { label: "Thu", kwh: 5.6 }, { label: "Fri", kwh: 6.2 }, { label: "Sat", kwh: 7.4 }, { label: "Sun", kwh: 4.9 },
];

export const PROPERTIES: Property[] = [
  { id: "p1", name: "The Meridian, Tower A", developer: "John Keells Properties", units: 420, uptime: 98, energyTrend: -14, engagementScore: 91 },
  { id: "p2", name: "The Meridian, Tower B", developer: "John Keells Properties", units: 398, uptime: 96, energyTrend: -9, engagementScore: 84 },
  { id: "p3", name: "Cinnamon Grand Residencies", developer: "John Keells Properties", units: 612, uptime: 94, energyTrend: -18, engagementScore: 88 },
  { id: "p4", name: "Ocean Heights Colombo", developer: "John Keells Properties", units: 340, uptime: 91, energyTrend: -6, engagementScore: 76 },
];

export const ADOPTION_DATA = [
  { label: "Smart Access", value: 94 },
  { label: "Scenes", value: 78 },
  { label: "Automation", value: 64 },
  { label: "Energy Insights", value: 71 },
];

export const PORTFOLIO_ENERGY = [
  { label: "Tower A", value: -14 },
  { label: "Tower B", value: -9 },
  { label: "Cinnamon Grand", value: -18 },
  { label: "Ocean Heights", value: -6 },
];

export const SEED_TICKETS: ServiceTicket[] = [
  {
    id: "t-m1",
    kind: "maintenance",
    category: "Plumbing",
    title: "Kitchen mixer dripping",
    detail: "Cold tap drips overnight. Started after last week's pressure test.",
    unitId: "12A",
    residentName: "Alex Perera",
    createdAt: "Yesterday, 19:12",
    status: "in-progress",
    priority: "medium",
  },
  {
    id: "t-c1",
    kind: "complaint",
    category: "Noise",
    title: "Late construction on floor 11",
    detail: "Drilling after 9pm for the last two nights.",
    unitId: "12A",
    residentName: "Alex Perera",
    createdAt: "2 days ago",
    status: "open",
    priority: "high",
  },
];

export const SEED_INVOICES: Invoice[] = [
  { id: "inv-sep", period: "September 2026", amount: 185000, currency: "LKR", dueDate: "25 Sep 2026", status: "due" },
  { id: "inv-aug", period: "August 2026", amount: 185000, currency: "LKR", dueDate: "25 Aug 2026", status: "paid", method: "Sampath Pay" },
  { id: "inv-jul", period: "July 2026", amount: 185000, currency: "LKR", dueDate: "25 Jul 2026", status: "paid", method: "Card ···· 4242" },
  { id: "inv-svc", period: "Service charge Q3", amount: 42000, currency: "LKR", dueDate: "10 Aug 2026", status: "paid", method: "Bank transfer" },
];

export const SEED_NOTICES: Notice[] = [
  {
    id: "nt1",
    title: "Pool closed Thursday 18:00–21:00",
    body: "Scheduled filter replacement. Gym remains open.",
    category: "outage",
    postedAt: "Today, 09:40",
    author: "Building Ops",
  },
  {
    id: "nt2",
    title: "Resident mixer · Sky Lounge",
    body: "Friday 19:30. RSVP on the community board. Guest limit: 1 per unit.",
    category: "event",
    postedAt: "Yesterday",
    author: "Building Ops",
  },
  {
    id: "nt3",
    title: "Visitor hours updated",
    body: "Contractors after 20:00 now need operator countersign in Nestura.",
    category: "policy",
    postedAt: "12 Sep",
    author: "Management",
  },
];

export const FACILITIES = [
  { id: "gym", name: "Gym", location: "Level 2" },
  { id: "bbq", name: "BBQ Terrace", location: "Podium" },
  { id: "hall", name: "Party Hall", location: "Level 3" },
  { id: "pool", name: "Lap Pool", location: "Level 2" },
];

export const SEED_BOOKINGS: FacilityBooking[] = [
  {
    id: "bk1",
    facilityId: "gym",
    facilityName: "Gym",
    date: "17 Sep",
    slot: "07:00–08:00",
    unitId: "12A",
    residentName: "Alex Perera",
    status: "confirmed",
  },
  {
    id: "bk2",
    facilityId: "bbq",
    facilityName: "BBQ Terrace",
    date: "20 Sep",
    slot: "18:00–20:00",
    unitId: "9D",
    residentName: "N. Silva",
    status: "confirmed",
  },
];

const FP_RESIDENT_NAMES = [
  "Amara Silva", "Ravi Perera", "Nadia Fernando", "Kavin Raj",
  "Meera Jayawardena", "Ismail Khan", "Dilini Wijesinghe", "Samuel Rajkumar",
  "Tharaka Fernando", "Zara Ahmed", "Dinesh Gunasekara", "Priya Sharma",
  "Lakmal De Silva", "Farah Hussain", "Charith Wickramasinghe", "Nisha Mendis",
  "Ruwan Bandara", "Saman Liyanage", "Fathima Nazar", "Kusal Samaraweera",
  "Madhavi Perera", "Ashan Fernando", "Dilrukshi Alahapperuma", "Imran Mohamed",
];

const FP_TIERS: ResidentTier[] = ["owner", "occupier", "tenant"];

function fpHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export const SEED_FLOOR_UNITS: FloorPlanUnit[] = (() => {
  const units: FloorPlanUnit[] = [];
  for (let floor = 3; floor <= 20; floor++) {
    ["A", "B", "C", "D"].forEach((letter) => {
      const label = `${floor}${letter}`;
      const hash = fpHash(label);
      const occupied = hash % 5 !== 0;
      units.push({
        id: label,
        levelCode: `L${floor}`,
        label,
        occupied,
        residentName: occupied ? FP_RESIDENT_NAMES[hash % FP_RESIDENT_NAMES.length] : "",
        tier: occupied ? FP_TIERS[(hash >> 3) % FP_TIERS.length] : "tenant",
        devices: occupied ? 3 + (hash % 8) : 0,
      });
    });
  }
  return units;
})();

export const SEED_SERVICE_REQUESTS: ServiceRequest[] = [
  { id: "sr1", unitId: "12A", residentName: "John Perera", kind: "cleaning", requestedAt: "Today, 09:15", scheduledFor: "Today, 2:00 PM", notes: "Standard clean of 2BR unit.", status: "pending" },
  { id: "sr2", unitId: "8F", residentName: "Amara Silva", kind: "maintenance", requestedAt: "Today, 08:40", scheduledFor: "Tomorrow, 10:00 AM", notes: "AC not cooling below 26°C.", status: "pending" },
  { id: "sr3", unitId: "18B", residentName: "Saman Liyanage", kind: "moving", requestedAt: "Yesterday, 17:30", scheduledFor: "Sat, 9:00 AM", notes: "Move-in — full coordination with front desk.", status: "scheduled" },
  { id: "sr4", unitId: "4C", residentName: "Ravi Perera", kind: "cleaning", requestedAt: "Today, 07:20", scheduledFor: "Today, 4:00 PM", notes: "Deep clean, 1BR balcony unit.", status: "pending" },
  { id: "sr5", unitId: "9D", residentName: "Nadia Fernando", kind: "maintenance", requestedAt: "Yesterday, 14:05", scheduledFor: "Today, 11:30 AM", notes: "Kitchen sink leak under counter.", status: "in-progress" },
  { id: "sr6", unitId: "14F", residentName: "Kavin Raj", kind: "moving", requestedAt: "3 days ago", scheduledFor: "Sun, 1:00 PM", notes: "Move-out inspection + freight elevator booking.", status: "pending" },
  { id: "sr7", unitId: "3C", residentName: "Meera Jayawardena", kind: "maintenance", requestedAt: "Today, 10:02", scheduledFor: "Tomorrow, 3:00 PM", notes: "Smart lock battery low — replacement.", status: "pending" },
];

export const SEED_FLOOR_AMENITIES: FloorPlanAmenity[] = [
  { id: "amenity-gym", name: "Fitness Center & Gym", levelCode: "L1", hours: "5:00 AM – 11:00 PM", status: "open" },
  { id: "amenity-yoga", name: "Yoga & Wellness Studio", levelCode: "L1", hours: "6:00 AM – 9:00 PM", status: "open" },
  { id: "amenity-kids", name: "Kids' Play Zone", levelCode: "L1", hours: "8:00 AM – 8:00 PM", status: "open" },
  { id: "amenity-coworking", name: "Co-working Lounge", levelCode: "L1", hours: "6:00 AM – 12:00 AM", status: "open" },
  { id: "amenity-business", name: "Business Center & Meeting Rooms", levelCode: "L2", hours: "8:00 AM – 8:00 PM", status: "open" },
  { id: "amenity-guest-suites", name: "Guest Suites", levelCode: "L2", hours: "Reception required", status: "open" },
  { id: "amenity-library", name: "Library Lounge", levelCode: "L2", hours: "9:00 AM – 9:00 PM", status: "open" },
  { id: "amenity-concierge", name: "Main Lobby & Concierge", levelCode: "G", hours: "24 / 7", status: "open" },
  { id: "amenity-mailroom", name: "Mailroom & Parcel Room", levelCode: "G", hours: "24 / 7 (staffed 8 AM – 8 PM)", status: "open" },
  { id: "amenity-security", name: "Security Office", levelCode: "G", hours: "24 / 7", status: "open" },
  { id: "amenity-resident-parking", name: "Resident Parking", levelCode: "B1", hours: "24 / 7", status: "open" },
  { id: "amenity-storage", name: "Storage Lockers", levelCode: "B1", hours: "Access via card", status: "open" },
  { id: "amenity-visitor-parking", name: "Visitor Parking", levelCode: "B2", hours: "24 / 7", status: "open" },
  { id: "amenity-ev", name: "EV Charging Bay", levelCode: "B2", hours: "24 / 7", status: "open" },
  { id: "amenity-pool", name: "Infinity Pool & Sundeck", levelCode: "R", hours: "6:00 AM – 10:00 PM", status: "open" },
  { id: "amenity-sky-lounge", name: "Sky Lounge & BBQ Deck", levelCode: "R", hours: "4:00 PM – 12:00 AM", status: "open" },
  { id: "amenity-observation", name: "Observation Terrace", levelCode: "R", hours: "6:00 AM – 10:00 PM", status: "open" },
];
