import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AlertItem,
  AppNotification,
  Automation,
  Device,
  FloorPlanAmenity,
  FloorPlanUnit,
  MaintenanceItem,
  ResidentTier,
  Role,
  Scene,
  ServiceRequest,
  VisitorRequest,
} from "@/types";
import {
  CURRENT_UNIT,
  SEED_ALERTS,
  SEED_AUTOMATIONS,
  SEED_DEVICES,
  SEED_FLOOR_AMENITIES,
  SEED_FLOOR_UNITS,
  SEED_MAINTENANCE,
  SEED_NOTIFICATIONS,
  SEED_SCENES,
  SEED_SERVICE_REQUESTS,
  SEED_VISITORS,
} from "@/data/seed";

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

  approveVisitor: (id: string) => void;
  rejectVisitor: (id: string) => void;
  addVisitorRequest: (v: VisitorRequest) => void;
  expireVisitor: (id: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (n: Omit<AppNotification, "id" | "time" | "read">) => void;

  acknowledgeAlert: (id: string) => void;
  updateMaintenanceStatus: (id: string, status: MaintenanceItem["status"]) => void;
  updateServiceRequestStatus: (id: string, status: ServiceRequest["status"]) => void;

  addFloorUnit: (unit: Omit<FloorPlanUnit, "id">) => void;
  updateFloorUnit: (id: string, patch: Partial<FloorPlanUnit>) => void;
  deleteFloorUnit: (id: string) => void;

  addFloorAmenity: (amenity: Omit<FloorPlanAmenity, "id">) => void;
  updateFloorAmenity: (id: string, patch: Partial<FloorPlanAmenity>) => void;
  deleteFloorAmenity: (id: string) => void;

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

      approveVisitor: (id) =>
        set((s) => ({ visitors: s.visitors.map((v) => (v.id === id ? { ...v, status: "approved" } : v)) })),

      rejectVisitor: (id) =>
        set((s) => ({ visitors: s.visitors.map((v) => (v.id === id ? { ...v, status: "rejected" } : v)) })),

      addVisitorRequest: (v) => set((s) => ({ visitors: [v, ...s.visitors] })),

      expireVisitor: (id) =>
        set((s) => ({ visitors: s.visitors.map((v) => (v.id === id ? { ...v, status: "expired" } : v)) })),

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

      updateServiceRequestStatus: (id, status) =>
        set((s) => ({ serviceRequests: s.serviceRequests.map((r) => (r.id === id ? { ...r, status } : r)) })),

      addFloorUnit: (unit) =>
        set((s) => {
          const id = unit.label.toUpperCase();
          if (s.floorUnits.some((u) => u.id === id)) return s;
          return { floorUnits: [...s.floorUnits, { ...unit, id }] };
        }),

      updateFloorUnit: (id, patch) =>
        set((s) => ({
          floorUnits: s.floorUnits.map((u) => (u.id === id ? { ...u, ...patch, id: patch.label ? patch.label.toUpperCase() : u.id } : u)),
        })),

      deleteFloorUnit: (id) =>
        set((s) => ({ floorUnits: s.floorUnits.filter((u) => u.id !== id) })),

      addFloorAmenity: (amenity) =>
        set((s) => ({
          floorAmenities: [{ ...amenity, id: uid("fp") }, ...s.floorAmenities],
        })),

      updateFloorAmenity: (id, patch) =>
        set((s) => ({ floorAmenities: s.floorAmenities.map((a) => (a.id === id ? { ...a, ...patch } : a)) })),

      deleteFloorAmenity: (id) =>
        set((s) => ({ floorAmenities: s.floorAmenities.filter((a) => a.id !== id) })),

      logActivity: (text) =>
        set((s) => ({ activityLog: [{ id: uid("log"), text, time: nowLabel() }, ...s.activityLog].slice(0, 30) })),
    }),
    {
      name: "jk-smart-living-store",
      partialize: (s) => ({
        theme: s.theme,
        role: s.role,
        residentTier: s.residentTier,
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
