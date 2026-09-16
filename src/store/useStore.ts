import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AlertItem,
  AppNotification,
  Automation,
  Device,
  FacilityBooking,
  FloorPlanAmenity,
  FloorPlanUnit,
  Invoice,
  MaintenanceItem,
  Notice,
  ResidentTier,
  Role,
  Scene,
  ServiceRequest,
  ServiceRequestStatus,
  ServiceTicket,
  TicketStatus,
  VisitorRequest,
} from "@/types";
import { persistRecord, deleteRecord } from "@/lib/persist";
import { persistVisitorRequest } from "@/lib/visitors";
import { useToastStore } from "@/store/toastStore";
import { TIER_PERMISSIONS } from "@/data/permissions";
import { type DemoAccount } from "@/data/demoAccounts";
import { canonicalUnitId, HOME_UNITS } from "@/lib/units";
import { createHomeDevices, CURRENT_UNIT, SEED_ALERTS, SEED_AUTOMATIONS, SEED_BOOKINGS, SEED_DEVICES, SEED_FLOOR_AMENITIES, SEED_FLOOR_UNITS, SEED_INVOICES, SEED_MAINTENANCE, SEED_NOTICES, SEED_NOTIFICATIONS, SEED_SCENES, SEED_SERVICE_REQUESTS, SEED_TICKETS, SEED_VISITORS } from "@/data/seed";

type Theme = "light" | "dark";

interface AppState {
  theme: Theme;
  role: Role;
  residentTier: ResidentTier;
  devices: Device[];
  scenes: Scene[];
  automations: Automation[];
  visitors: VisitorRequest[];
  notifications: AppNotification[];
  maintenance: MaintenanceItem[];
  alerts: AlertItem[];
  tickets: ServiceTicket[];
  invoices: Invoice[];
  notices: Notice[];
  bookings: FacilityBooking[];
  serviceRequests: ServiceRequest[];
  floorUnits: FloorPlanUnit[];
  floorAmenities: FloorPlanAmenity[];
  activityLog: { id: string; text: string; time: string }[];
  lastActivatedScene: string | null;
  accountKey: string;
  accountName: string;
  accountEmail: string;
  accountUnitId: string;

  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setRole: (r: Role) => void;
  setResidentTier: (t: ResidentTier) => void;
  setAccount: (account: DemoAccount) => void;
  applyRemoteCollection: (collection: string, rows: { id: string }[], replace?: boolean) => void;

  toggleDevicePower: (id: string) => void;
  setDeviceValue: (id: string, value: number) => void;
  addDevice: (device: Omit<Device, "id" | "lastHeartbeat" | "status" | "health"> & Partial<Device>) => void;
  updateDevice: (id: string, patch: Partial<Device>) => void;
  deleteDevice: (id: string) => void;
  setUnitDevicesPower: (unitId: string, power: boolean) => void;
  ensureHomeKits: () => void;
  deleteScene: (id: string) => void;
  deleteAutomation: (id: string) => void;

  runScene: (sceneId: string) => void;
  addScene: (scene: Scene) => void;

  toggleAutomation: (id: string) => void;
  addAutomation: (a: Automation) => void;
  acceptSuggestedAutomation: (id: string) => void;

  approveVisitor: (id: string, grant?: { requestedFor: string; windowStart: string; windowEnd: string }) => void;
  rejectVisitor: (id: string) => void;
  addVisitorRequest: (v: VisitorRequest) => void;
  expireVisitor: (id: string) => void;
  setVisitorAccess: (id: string, enabled: boolean) => void;
  setVisitorDoor: (id: string, unlocked: boolean) => void;
  mergeVisitors: (rows: VisitorRequest[]) => void;
  mergeServiceRequests: (rows: ServiceRequest[]) => void;
  updateServiceRequestStatus: (id: string, status: ServiceRequestStatus) => void;

  addFloorUnit: (unit: Omit<FloorPlanUnit, "id">) => void;
  updateFloorUnit: (id: string, patch: Partial<FloorPlanUnit>) => void;
  deleteFloorUnit: (id: string) => void;
  addFloorAmenity: (amenity: Omit<FloorPlanAmenity, "id">) => void;
  updateFloorAmenity: (id: string, patch: Partial<FloorPlanAmenity>) => void;
  deleteFloorAmenity: (id: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (n: Omit<AppNotification, "id" | "time" | "read">) => void;
  mergeNotifications: (rows: AppNotification[]) => void;

  acknowledgeAlert: (id: string) => void;
  addAlert: (alert: Omit<AlertItem, "id" | "time" | "acknowledged">) => void;
  mergeAlerts: (rows: AlertItem[]) => void;
  updateMaintenanceStatus: (id: string, status: MaintenanceItem["status"]) => void;

  addTicket: (t: Omit<ServiceTicket, "id" | "createdAt" | "unitId" | "residentName" | "status">) => void;
  updateTicketStatus: (id: string, status: TicketStatus) => void;
  payInvoice: (id: string) => void;
  addNotice: (n: Omit<Notice, "id" | "postedAt">) => void;
  addBooking: (b: Omit<FacilityBooking, "id" | "status" | "unitId" | "residentName">) => boolean;
  cancelBooking: (id: string) => void;

  logActivity: (text: string) => void;
  householdAccess: Record<string, boolean>;
  setHouseholdAccess: (accountKey: string, canAccess: boolean) => void;
  fireAutomation: (id: string) => void;
}

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "light",
      role: "resident",
      residentTier: "owner",
      devices: SEED_DEVICES,
      scenes: SEED_SCENES,
      automations: SEED_AUTOMATIONS,
      visitors: SEED_VISITORS,
      notifications: SEED_NOTIFICATIONS,
      maintenance: SEED_MAINTENANCE,
      alerts: SEED_ALERTS,
      tickets: SEED_TICKETS,
      invoices: SEED_INVOICES,
      notices: SEED_NOTICES,
      bookings: SEED_BOOKINGS,
      serviceRequests: SEED_SERVICE_REQUESTS,
      floorUnits: SEED_FLOOR_UNITS,
      floorAmenities: SEED_FLOOR_AMENITIES,
      activityLog: [
        { id: uid("log"), text: "Evening Arrival activated", time: "18:24" },
        { id: uid("log"), text: "AC set to 24°C", time: "18:25" },
        { id: uid("log"), text: "Front door unlocked", time: "18:24" },
      ],
      lastActivatedScene: null,
      householdAccess: {
        "w001-occupier": true,
        "w002-spouse": true,
        "w002-child": false,
      },
      accountKey: "w001-owner",
      accountName: "John Perera",
      accountEmail: "john.owner@example.com",
      accountUnitId: "W001",

      setTheme: (t) => set({ theme: t }),
      toggleTheme: () => set({ theme: get().theme === "light" ? "dark" : "light" }),
      setRole: (r) => set({ role: r }),
      setResidentTier: (t) => set({ residentTier: t }),
      setAccount: (account) => {
        const unitId = canonicalUnitId(account.unitId);
        set({
          accountKey: account.key,
          accountName: account.name,
          accountEmail: account.email,
          accountUnitId: unitId,
          role: account.role,
          residentTier: account.tier ?? get().residentTier,
        });
        get().ensureHomeKits();
      },
      applyRemoteCollection: (collection, rows, replace = false) => {
        if (!rows.length && !replace) return;
        const mapKey: Record<string, keyof AppState> = {
          devices: "devices",
          scenes: "scenes",
          automations: "automations",
          notifications: "notifications",
          maintenance_items: "maintenance",
          alerts: "alerts",
          service_tickets: "tickets",
          invoices: "invoices",
          notices: "notices",
          facility_bookings: "bookings",
          service_requests: "serviceRequests",
          floor_units: "floorUnits",
          floor_amenities: "floorAmenities",
        };
        const key = mapKey[collection];
        if (!key) return;
        const normalized =
          collection === "devices"
            ? rows.map((row) => {
                const d = row as Device;
                return { ...d, unitId: canonicalUnitId(d.unitId) };
              })
            : rows;
        set((s) => {
          if (replace) return { [key]: normalized } as Partial<AppState>;
          const current = (s[key] as { id: string }[]) ?? [];
          const merged = new Map(current.map((row) => [row.id, row]));
          normalized.forEach((row) => merged.set(row.id, row));
          return { [key]: Array.from(merged.values()) } as Partial<AppState>;
        });
      },

      toggleDevicePower: (id) => {
        set((s) => ({
          devices: s.devices.map((d) => (d.id === id ? { ...d, power: !d.power, lastHeartbeat: "just now" } : d)),
        }));
        const row = get().devices.find((d) => d.id === id);
        if (row) {
          void persistRecord("devices", row);
          get().logActivity(`${row.name} ${row.kind === "door" ? (row.power ? "locked" : "unlocked") : row.power ? "on" : "off"}`);
          if (row.kind === "door") {
            useToastStore.getState().pushToast({
              title: row.name,
              body: row.power ? "Locked" : "Unlocked",
              tone: row.power ? "success" : "warning",
            });
          }
        }
      },

      setDeviceValue: (id, value) => {
        set((s) => ({
          devices: s.devices.map((d) => (d.id === id ? { ...d, value, lastHeartbeat: "just now" } : d)),
        }));
        const row = get().devices.find((d) => d.id === id);
        if (row) void persistRecord("devices", row);
      },

      addDevice: (input) => {
        const unitId = canonicalUnitId(input.unitId || get().accountUnitId);
        const row: Device = {
          status: "online",
          health: 100,
          lastHeartbeat: "just now",
          ...input,
          power: input.power ?? false,
          id: input.id || `dev-${Math.random().toString(36).slice(2, 8)}`,
          unitId,
        };
        set((s) => ({ devices: [row, ...s.devices] }));
        void persistRecord("devices", row);
        get().logActivity(`Added ${row.name} to ${unitId}`);
      },

      updateDevice: (id, patch) => {
        set((s) => ({
          devices: s.devices.map((d) => (d.id === id ? { ...d, ...patch, lastHeartbeat: "just now" } : d)),
        }));
        const row = get().devices.find((d) => d.id === id);
        if (row) void persistRecord("devices", row);
      },

      deleteDevice: (id) => {
        const row = get().devices.find((d) => d.id === id);
        set((s) => ({
          devices: s.devices.filter((d) => d.id !== id),
          scenes: s.scenes.map((sc) => ({ ...sc, actions: sc.actions.filter((a) => a.deviceId !== id) })),
        }));
        void deleteRecord("devices", id);
        if (row) get().logActivity(`Removed ${row.name}`);
      },

      setUnitDevicesPower: (unitId, power) => {
        const unit = canonicalUnitId(unitId);
        set((s) => ({
          devices: s.devices.map((d) =>
            d.unitId === unit && d.kind !== "sensor" && d.kind !== "door" ? { ...d, power, lastHeartbeat: "just now" } : d,
          ),
        }));
        get()
          .devices.filter((d) => d.unitId === unit)
          .forEach((d) => void persistRecord("devices", d));
      },

      ensureHomeKits: () => {
        const extra: Device[] = [];
        const mapped = get().devices.map((d) => ({ ...d, unitId: canonicalUnitId(d.unitId) || d.unitId }));
        for (const unit of HOME_UNITS) {
          const existing = mapped.filter((d) => d.unitId === unit);
          if (existing.length === 0) extra.push(...createHomeDevices(unit));
          else {
            for (const lock of createHomeDevices(unit).filter((d) => d.kind === "door")) {
              if (!existing.some((d) => d.kind === "door" && (d.id === lock.id || d.name === lock.name))) extra.push(lock);
            }
          }
        }
        set({
          devices: extra.length ? [...mapped, ...extra] : mapped,
          accountUnitId: canonicalUnitId(get().accountUnitId),
        });
        extra.forEach((d) => void persistRecord("devices", d));
      },

      deleteScene: (id) => {
        set((s) => ({ scenes: s.scenes.filter((sc) => sc.id !== id) }));
        void deleteRecord("scenes", id);
      },
      deleteAutomation: (id) => {
        set((s) => ({ automations: s.automations.filter((a) => a.id !== id) }));
        void deleteRecord("automations", id);
      },

      runScene: (sceneId) => {
        const scene = get().scenes.find((s) => s.id === sceneId);
        if (!scene) return;
        const unitId = get().accountUnitId;
        const role = get().role;
        let matched = 0;
        const devices = get().devices.map((d) => {
          if (role === "resident" && unitId && d.unitId !== unitId) return d;
          const action = scene.actions.find(
            (a) => a.deviceId === d.id || (a.deviceName === d.name && a.kind === d.kind),
          );
          if (!action) return d;
          matched += 1;
          return {
            ...d,
            power: action.power ?? d.power,
            value: action.value ?? d.value,
            lastHeartbeat: "just now",
          };
        });
        set((s) => ({
          devices,
          scenes: s.scenes.map((sc) => (sc.id === sceneId ? { ...sc, lastRun: `Today, ${nowLabel()}` } : sc)),
          lastActivatedScene: sceneId,
        }));
        get().logActivity(`${scene.name} activated`);
        scene.actions.forEach((a) => get().logActivity(`${a.deviceName} → ${a.action}`));
        useToastStore.getState().pushToast({
          title: scene.name,
          body: matched
            ? `Applied to ${matched} device${matched === 1 ? "" : "s"} in ${unitId || "this home"}.`
            : "No devices in this unit matched the scene. Recreate it with Create scene.",
          tone: matched ? "success" : "warning",
        });
      },

      addScene: (scene) => {
        const row = { ...scene, unitId: scene.unitId || get().accountUnitId };
        set((s) => ({ scenes: [row, ...s.scenes] }));
        void persistRecord("scenes", row);
      },

      toggleAutomation: (id) =>
        set((s) => ({ automations: s.automations.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)) })),

      addAutomation: (a) => {
        const row = { ...a, unitId: a.unitId || get().accountUnitId };
        set((s) => ({ automations: [row, ...s.automations] }));
        void persistRecord("automations", row);
      },

      fireAutomation: (id) => {
        const a = get().automations.find((x) => x.id === id);
        if (!a || !a.enabled) return;
        get().runScene(a.sceneId);
        set((s) => ({
          automations: s.automations.map((x) =>
            x.id === id ? { ...x, lastTriggered: new Date().toISOString().slice(0, 16) } : x,
          ),
        }));
      },

      setHouseholdAccess: (accountKey, canAccess) => {
        set((s) => ({ householdAccess: { ...s.householdAccess, [accountKey]: canAccess } }));
        get().logActivity(`Household access ${canAccess ? "granted" : "revoked"} for ${accountKey}`);
      },

      acceptSuggestedAutomation: (id) =>
        set((s) => ({ automations: s.automations.map((a) => (a.id === id ? { ...a, aiSuggested: false, enabled: true } : a)) })),

      approveVisitor: (id, grant) => {
        let next: VisitorRequest | undefined;
        set((s) => ({
          visitors: s.visitors.map((v) => {
            if (v.id !== id) return v;
            next = {
              ...v,
              status: "approved",
              accessEnabled: true,
              doorUnlocked: false,
              requestedFor: grant?.requestedFor ?? v.requestedFor,
              windowStart: grant?.windowStart ?? v.windowStart,
              windowEnd: grant?.windowEnd ?? v.windowEnd,
            };
            return next;
          }),
        }));
        if (next) {
          void persistVisitorRequest(next);
          get().logActivity(`Granted ${next.passCode} for ${next.name} · ${next.windowStart}–${next.windowEnd}`);
        }
      },

      rejectVisitor: (id) => {
        let next: VisitorRequest | undefined;
        set((s) => ({
          visitors: s.visitors.map((v) => {
            if (v.id !== id) return v;
            next = { ...v, status: "rejected", accessEnabled: false, doorUnlocked: false };
            return next;
          }),
        }));
        if (next) {
          void persistVisitorRequest(next);
          get().logActivity(`Rejected ${next.passCode} for ${next.name}`);
        }
      },

      addVisitorRequest: (v) => {
        set((s) => ({ visitors: [v, ...s.visitors] }));
        void persistVisitorRequest(v);
        get().logActivity(`Visitor ${v.name} · ${v.passCode} · ${v.status}`);
      },

      expireVisitor: (id) => {
        let next: VisitorRequest | undefined;
        set((s) => ({
          visitors: s.visitors.map((v) => {
            if (v.id !== id) return v;
            next = { ...v, status: "expired", accessEnabled: false, doorUnlocked: false };
            return next;
          }),
        }));
        if (next) void persistVisitorRequest(next);
      },

      setVisitorAccess: (id, enabled) => {
        let next: VisitorRequest | undefined;
        set((s) => ({
          visitors: s.visitors.map((v) => {
            if (v.id !== id) return v;
            next = {
              ...v,
              accessEnabled: enabled,
              doorUnlocked: enabled ? v.doorUnlocked : false,
              status: enabled ? (v.status === "revoked" ? "approved" : v.status) : "revoked",
            };
            return next;
          }),
        }));
        if (next) {
          void persistVisitorRequest(next);
          get().logActivity(`${enabled ? "Reactivated" : "Deactivated"} pass ${next.passCode} for ${next.name}`);
        }
      },

      setVisitorDoor: (id, unlocked) => {
        let next: VisitorRequest | undefined;
        const unitId = get().visitors.find((v) => v.id === id)?.unitId;
        set((s) => ({
          visitors: s.visitors.map((v) => {
            if (v.id !== id) return v;
            next = { ...v, doorUnlocked: unlocked };
            return next;
          }),
          devices: s.devices.map((d) =>
            d.kind === "door" && d.unitId === unitId ? { ...d, power: !unlocked, lastHeartbeat: "just now" } : d,
          ),
        }));
        if (next) {
          void persistVisitorRequest(next);
          get().logActivity(`${unlocked ? "Door unlocked" : "Door locked"} by visitor ${next.name}`);
        }
      },

      mergeVisitors: (rows) =>
        set((s) => {
          const map = new Map(s.visitors.map((v) => [v.id, v]));
          rows.forEach((v) => map.set(v.id, v));
          return { visitors: Array.from(map.values()) };
        }),

      mergeServiceRequests: (rows) =>
        set((s) => {
          const map = new Map(s.serviceRequests.map((v) => [v.id, v]));
          rows.forEach((v) => map.set(v.id, v));
          return { serviceRequests: Array.from(map.values()) };
        }),

      updateServiceRequestStatus: (id, status) => {
        let next: ServiceRequest | undefined;
        set((s) => ({
          serviceRequests: s.serviceRequests.map((r) => {
            if (r.id !== id) return r;
            next = {
              ...r,
              status,
              statusHistory: [...(r.statusHistory ?? []), { status, at: nowLabel() }],
            };
            return next;
          }),
        }));
        if (next) void persistRecord("service_requests", next);
      },

      addFloorUnit: (unit) =>
        set((s) => {
          const id = unit.label.toUpperCase();
          if (s.floorUnits.some((u) => u.id === id)) return s;
          const row = { ...unit, id };
          void persistRecord("floor_units", row);
          return { floorUnits: [...s.floorUnits, row] };
        }),
      updateFloorUnit: (id, patch) =>
        set((s) => {
          const floorUnits = s.floorUnits.map((u) =>
            u.id === id ? { ...u, ...patch, id: patch.label ? patch.label.toUpperCase() : u.id } : u,
          );
          const row = floorUnits.find((u) => u.id === (patch.label ? patch.label.toUpperCase() : id));
          if (row) void persistRecord("floor_units", row);
          return { floorUnits };
        }),
      deleteFloorUnit: (id) => set((s) => ({ floorUnits: s.floorUnits.filter((u) => u.id !== id) })),
      addFloorAmenity: (amenity) => {
        const row = { ...amenity, id: uid("fp") };
        set((s) => ({ floorAmenities: [row, ...s.floorAmenities] }));
        void persistRecord("floor_amenities", row);
      },
      updateFloorAmenity: (id, patch) =>
        set((s) => {
          const floorAmenities = s.floorAmenities.map((a) => (a.id === id ? { ...a, ...patch } : a));
          const row = floorAmenities.find((a) => a.id === id);
          if (row) void persistRecord("floor_amenities", row);
          return { floorAmenities };
        }),
      deleteFloorAmenity: (id) =>
        set((s) => ({ floorAmenities: s.floorAmenities.filter((a) => a.id !== id) })),

      markNotificationRead: (id) =>
        set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),

      markAllNotificationsRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

      addNotification: (n) => {
        const row: AppNotification = {
          ...n,
          id: uid("note"),
          time: "Just now",
          read: false,
          unitId: n.unitId ?? (get().role === "operator" || get().role === "developer" ? undefined : get().accountUnitId),
        };
        set((s) => ({ notifications: [row, ...s.notifications] }));
        void persistRecord("notifications", row);
        const tone =
          n.category === "security" ? "danger" : n.category === "energy" || n.category === "maintenance" ? "warning" : n.category === "billing" ? "success" : "info";
        useToastStore.getState().pushToast({ title: n.title, body: n.body, tone });
      },

      mergeNotifications: (rows) =>
        set((s) => {
          const map = new Map(s.notifications.map((v) => [v.id, v]));
          rows.forEach((v) => map.set(v.id, v));
          return { notifications: Array.from(map.values()) };
        }),

      acknowledgeAlert: (id) => {
        let next: AlertItem | undefined;
        set((s) => ({
          alerts: s.alerts.map((a) => {
            if (a.id !== id) return a;
            next = { ...a, acknowledged: true };
            return next;
          }),
        }));
        if (next) void persistRecord("alerts", next);
      },

      addAlert: (alert) => {
        const row: AlertItem = {
          ...alert,
          id: uid("alert"),
          time: nowLabel(),
          acknowledged: false,
        };
        set((s) => ({ alerts: [row, ...s.alerts] }));
        void persistRecord("alerts", row);
        get().addNotification({
          icon: "AlertTriangle",
          title: row.title,
          body: row.location,
          category: "security",
          unitId: row.broadcast ? undefined : row.unitId,
        });
      },

      mergeAlerts: (rows) =>
        set((s) => {
          const map = new Map(s.alerts.map((v) => [v.id, v]));
          rows.forEach((v) => map.set(v.id, v));
          return { alerts: Array.from(map.values()) };
        }),

      updateMaintenanceStatus: (id, status) =>
        set((s) => ({ maintenance: s.maintenance.map((m) => (m.id === id ? { ...m, status } : m)) })),

      addTicket: (t) => {
        const row = {
          ...t,
          id: uid("t"),
          createdAt: `Today, ${nowLabel()}`,
          unitId: get().accountUnitId || CURRENT_UNIT.id,
          residentName: get().accountName || CURRENT_UNIT.residentName,
          status: "open" as const,
        };
        set((s) => ({ tickets: [row, ...s.tickets] }));
        void persistRecord("service_tickets", row);
      },

      updateTicketStatus: (id, status) => {
        let next: ServiceTicket | undefined;
        set((s) => ({
          tickets: s.tickets.map((t) => {
            if (t.id !== id) return t;
            next = { ...t, status };
            return next;
          }),
        }));
        if (next) void persistRecord("service_tickets", next);
      },

      payInvoice: (id) => {
        let next: Invoice | undefined;
        set((s) => ({
          invoices: s.invoices.map((i) => {
            if (i.id !== id) return i;
            next = { ...i, status: "paid", method: "Nestura Pay" };
            return next;
          }),
        }));
        if (next) void persistRecord("invoices", next);
      },

      addNotice: (n) => {
        const row = { ...n, id: uid("nt"), postedAt: `Today, ${nowLabel()}` };
        set((s) => ({ notices: [row, ...s.notices] }));
        void persistRecord("notices", row);
      },

      addBooking: (b) => {
        const taken = get().bookings.some(
          (x) => x.facilityId === b.facilityId && x.date === b.date && x.slot === b.slot && x.status === "confirmed",
        );
        if (taken) return false;
        const row = {
          ...b,
          id: uid("bk"),
          unitId: get().accountUnitId || CURRENT_UNIT.id,
          residentName: get().accountName || CURRENT_UNIT.residentName,
          status: "confirmed" as const,
        };
        set((s) => ({ bookings: [row, ...s.bookings] }));
        void persistRecord("facility_bookings", row);
        return true;
      },

      cancelBooking: (id) => {
        let next: FacilityBooking | undefined;
        set((s) => ({
          bookings: s.bookings.map((b) => {
            if (b.id !== id) return b;
            next = { ...b, status: "cancelled" };
            return next;
          }),
        }));
        if (next) void persistRecord("facility_bookings", next);
      },

      logActivity: (text) =>
        set((s) => ({ activityLog: [{ id: uid("log"), text, time: nowLabel() }, ...s.activityLog].slice(0, 30) })),
    }),
    {
      name: "jk-smart-living-store",
      version: 6,
      migrate: (persisted) => {
        const rec = persisted as Record<string, unknown>;
        const mapU = (u: string) => (u === "12A" ? "W001" : u === "18B" ? "W002" : u === "8F" ? "W003" : u);
        if (typeof rec.accountUnitId === "string") rec.accountUnitId = mapU(rec.accountUnitId);
        if (Array.isArray(rec.visitors)) {
          rec.visitors = (rec.visitors as { unitId?: string }[]).map((v) => ({ ...v, unitId: v.unitId ? mapU(v.unitId) : v.unitId }));
        }
        if (Array.isArray(rec.devices)) {
          rec.devices = (rec.devices as { unitId?: string }[]).map((d) => ({ ...d, unitId: d.unitId ? mapU(d.unitId) : d.unitId }));
        }
        if (!rec.householdAccess || typeof rec.householdAccess !== "object") {
          rec.householdAccess = { "w001-occupier": true, "w002-spouse": true, "w002-child": false };
        }
        return rec;
      },
      partialize: (s) => ({
        theme: s.theme,
        role: s.role,
        residentTier: s.residentTier,
        accountKey: s.accountKey,
        accountName: s.accountName,
        accountEmail: s.accountEmail,
        accountUnitId: s.accountUnitId,
        visitors: s.visitors,
        devices: s.devices,
        scenes: s.scenes,
        automations: s.automations,
        serviceRequests: s.serviceRequests,
        floorUnits: s.floorUnits,
        floorAmenities: s.floorAmenities,
        householdAccess: s.householdAccess,
      }),
      onRehydrateStorage: () => (state) => {
        state?.ensureHomeKits();
      },
    },
  ),
);

/**
 * Devices scoped to the signed-in resident's own unit. The full `devices`
 * list in the store spans the whole building fleet (used by the Operator's
 * Device Fleet view) — resident-facing screens must never read from it
 * directly, or a scene/automation for one apartment could end up touching
 * another resident's devices.
 */
export function useResidentDevices() {
  const unitId = canonicalUnitId(useStore((s) => s.accountUnitId));
  return useStore((s) =>
    s.devices.filter((d) => {
      const u = canonicalUnitId(d.unitId);
      if (unitId === "Tower A" || unitId === "Portfolio") return true;
      return u === (unitId || CURRENT_UNIT.id);
    }),
  );
}

export function useResidentScenes() {
  const unitId = canonicalUnitId(useStore((s) => s.accountUnitId));
  return useStore((s) => s.scenes.filter((sc) => !sc.unitId || canonicalUnitId(sc.unitId) === unitId));
}

export function useResidentAutomations() {
  const unitId = canonicalUnitId(useStore((s) => s.accountUnitId));
  return useStore((s) => s.automations.filter((a) => !a.unitId || canonicalUnitId(a.unitId) === unitId));
}

export function useCanManageAccess() {
  const role = useStore((s) => s.role);
  const residentTier = useStore((s) => s.residentTier);
  const accountKey = useStore((s) => s.accountKey);
  const householdAccess = useStore((s) => s.householdAccess);
  if (role !== "resident") return true;
  if (residentTier === "owner") return true;
  if (Object.prototype.hasOwnProperty.call(householdAccess, accountKey)) return householdAccess[accountKey];
  return TIER_PERMISSIONS[residentTier].access;
}

export function useVisibleNotifications() {
  const role = useStore((s) => s.role);
  const unitId = useStore((s) => s.accountUnitId);
  const notifications = useStore((s) => s.notifications);
  if (role === "operator" || role === "developer") return notifications;
  return notifications.filter((n) => !n.unitId || n.unitId === unitId);
}
