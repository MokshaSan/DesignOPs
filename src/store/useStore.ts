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
import {
  CURRENT_UNIT,
  SEED_ALERTS,
  SEED_AUTOMATIONS,
  SEED_BOOKINGS,
  SEED_DEVICES,
  SEED_FLOOR_AMENITIES,
  SEED_FLOOR_UNITS,
  SEED_INVOICES,
  SEED_MAINTENANCE,
  SEED_NOTICES,
  SEED_NOTIFICATIONS,
  SEED_SCENES,
  SEED_SERVICE_REQUESTS,
  SEED_TICKETS,
  SEED_VISITORS,
} from "@/data/seed";
import { persistRecord } from "@/lib/persist";
import { persistVisitorRequest } from "@/lib/visitors";

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

  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setRole: (r: Role) => void;
  setResidentTier: (t: ResidentTier) => void;

  toggleDevicePower: (id: string) => void;
  setDeviceValue: (id: string, value: number) => void;

  runScene: (sceneId: string) => void;
  addScene: (scene: Scene) => void;

  toggleAutomation: (id: string) => void;
  addAutomation: (a: Automation) => void;
  acceptSuggestedAutomation: (id: string) => void;

  approveVisitor: (id: string, grant?: { requestedFor: string; windowStart: string; windowEnd: string }) => void;
  rejectVisitor: (id: string) => void;
  addVisitorRequest: (v: VisitorRequest) => void;
  expireVisitor: (id: string) => void;
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

  acknowledgeAlert: (id: string) => void;
  updateMaintenanceStatus: (id: string, status: MaintenanceItem["status"]) => void;

  addTicket: (t: Omit<ServiceTicket, "id" | "createdAt" | "unitId" | "residentName" | "status">) => void;
  updateTicketStatus: (id: string, status: TicketStatus) => void;
  payInvoice: (id: string) => void;
  addNotice: (n: Omit<Notice, "id" | "postedAt">) => void;
  addBooking: (b: Omit<FacilityBooking, "id" | "status" | "unitId" | "residentName">) => boolean;
  cancelBooking: (id: string) => void;

  logActivity: (text: string) => void;
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

      setTheme: (t) => set({ theme: t }),
      toggleTheme: () => set({ theme: get().theme === "light" ? "dark" : "light" }),
      setRole: (r) => set({ role: r }),
      setResidentTier: (t) => set({ residentTier: t }),

      toggleDevicePower: (id) =>
        set((s) => ({
          devices: s.devices.map((d) => (d.id === id ? { ...d, power: !d.power, lastHeartbeat: "just now" } : d)),
        })),

      setDeviceValue: (id, value) =>
        set((s) => ({
          devices: s.devices.map((d) => (d.id === id ? { ...d, value, lastHeartbeat: "just now" } : d)),
        })),

      runScene: (sceneId) => {
        const scene = get().scenes.find((s) => s.id === sceneId);
        if (!scene) return;
        set((s) => ({
          devices: s.devices.map((d) => {
            const action = scene.actions.find((a) => a.deviceId === d.id);
            if (!action) return d;
            return {
              ...d,
              power: action.power ?? d.power,
              value: action.value ?? d.value,
              lastHeartbeat: "just now",
            };
          }),
          scenes: s.scenes.map((sc) => (sc.id === sceneId ? { ...sc, lastRun: `Today, ${nowLabel()}` } : sc)),
          lastActivatedScene: sceneId,
        }));
        get().logActivity(`${scene.name} activated`);
        scene.actions.forEach((a) => get().logActivity(`${a.deviceName} → ${a.action}`));
      },

      addScene: (scene) => set((s) => ({ scenes: [scene, ...s.scenes] })),

      toggleAutomation: (id) =>
        set((s) => ({ automations: s.automations.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)) })),

      addAutomation: (a) => set((s) => ({ automations: [a, ...s.automations] })),

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
              requestedFor: grant?.requestedFor ?? v.requestedFor,
              windowStart: grant?.windowStart ?? v.windowStart,
              windowEnd: grant?.windowEnd ?? v.windowEnd,
            };
            return next;
          }),
        }));
        if (next) void persistVisitorRequest(next);
      },

      rejectVisitor: (id) => {
        let next: VisitorRequest | undefined;
        set((s) => ({
          visitors: s.visitors.map((v) => {
            if (v.id !== id) return v;
            next = { ...v, status: "rejected" };
            return next;
          }),
        }));
        if (next) void persistVisitorRequest(next);
      },

      addVisitorRequest: (v) => {
        set((s) => ({ visitors: [v, ...s.visitors] }));
        void persistVisitorRequest(v);
      },

      expireVisitor: (id) => {
        let next: VisitorRequest | undefined;
        set((s) => ({
          visitors: s.visitors.map((v) => {
            if (v.id !== id) return v;
            next = { ...v, status: "expired" };
            return next;
          }),
        }));
        if (next) void persistVisitorRequest(next);
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
            next = { ...r, status };
            return next;
          }),
        }));
        if (next) void persistRecord("service_requests", next);
      },

      addFloorUnit: (unit) =>
        set((s) => {
          const id = unit.label.toUpperCase();
          if (s.floorUnits.some((u) => u.id === id)) return s;
          return { floorUnits: [...s.floorUnits, { ...unit, id }] };
        }),
      updateFloorUnit: (id, patch) =>
        set((s) => ({
          floorUnits: s.floorUnits.map((u) =>
            u.id === id ? { ...u, ...patch, id: patch.label ? patch.label.toUpperCase() : u.id } : u,
          ),
        })),
      deleteFloorUnit: (id) => set((s) => ({ floorUnits: s.floorUnits.filter((u) => u.id !== id) })),
      addFloorAmenity: (amenity) =>
        set((s) => ({ floorAmenities: [{ ...amenity, id: uid("fp") }, ...s.floorAmenities] })),
      updateFloorAmenity: (id, patch) =>
        set((s) => ({ floorAmenities: s.floorAmenities.map((a) => (a.id === id ? { ...a, ...patch } : a)) })),
      deleteFloorAmenity: (id) =>
        set((s) => ({ floorAmenities: s.floorAmenities.filter((a) => a.id !== id) })),

      markNotificationRead: (id) =>
        set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),

      markAllNotificationsRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

      addNotification: (n) =>
        set((s) => ({
          notifications: [{ ...n, id: uid("note"), time: "Just now", read: false }, ...s.notifications],
        })),

      acknowledgeAlert: (id) =>
        set((s) => ({ alerts: s.alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)) })),

      updateMaintenanceStatus: (id, status) =>
        set((s) => ({ maintenance: s.maintenance.map((m) => (m.id === id ? { ...m, status } : m)) })),

      addTicket: (t) => {
        const row = {
          ...t,
          id: uid("t"),
          createdAt: `Today, ${nowLabel()}`,
          unitId: CURRENT_UNIT.id,
          residentName: CURRENT_UNIT.residentName,
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
          unitId: CURRENT_UNIT.id,
          residentName: CURRENT_UNIT.residentName,
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
      partialize: (s) => ({
        theme: s.theme,
        role: s.role,
        residentTier: s.residentTier,
        visitors: s.visitors,
        serviceRequests: s.serviceRequests,
        floorUnits: s.floorUnits,
        floorAmenities: s.floorAmenities,
      }),
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
  return useStore((s) => s.devices.filter((d) => d.unitId === CURRENT_UNIT.id));
}
