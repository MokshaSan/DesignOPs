import { useEffect } from "react";
import { AppRoutes } from "@/routes/AppRoutes";
import { useThemeSync } from "@/hooks/useThemeSync";
import { useSimulatedTelemetry } from "@/hooks/useSimulatedTelemetry";
import { fetchVisitorRequests, subscribeVisitorRequests } from "@/lib/visitors";
import { hydrateAll, seedCollection, subscribeRecords, COLLECTIONS } from "@/lib/persist";
import { useStore } from "@/store/useStore";
import { ToastHost } from "@/components/ui/ToastHost";
import { CriticalAlertOverlay } from "@/components/alerts/CriticalAlertOverlay";
import {
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
} from "@/data/seed";

const BOOTSTRAP: Record<string, { id: string }[]> = {
  devices: SEED_DEVICES,
  scenes: SEED_SCENES,
  automations: SEED_AUTOMATIONS,
  notifications: SEED_NOTIFICATIONS,
  maintenance_items: SEED_MAINTENANCE,
  service_tickets: SEED_TICKETS,
  invoices: SEED_INVOICES,
  notices: SEED_NOTICES,
  facility_bookings: SEED_BOOKINGS,
  service_requests: SEED_SERVICE_REQUESTS,
  floor_units: SEED_FLOOR_UNITS,
  floor_amenities: SEED_FLOOR_AMENITIES,
};

export default function App() {
  useThemeSync();
  useSimulatedTelemetry();

  useEffect(() => {
    void (async () => {
      const state = useStore.getState();
      const visitors = await fetchVisitorRequests();
      if (visitors.length) state.mergeVisitors(visitors);

      const remote = await hydrateAll();
      for (const collection of COLLECTIONS) {
        const rows = remote[collection] ?? [];
        if (rows.length) {
          state.applyRemoteCollection(collection, rows, true);
        } else if (BOOTSTRAP[collection]) {
          await seedCollection(collection, BOOTSTRAP[collection]);
        }
      }
    })();

    const unsubVisitors = subscribeVisitorRequests((rows) => {
      if (rows.length) useStore.getState().mergeVisitors(rows);
    });
    const unsubRecords = subscribeRecords((collection, payload) => {
      useStore.getState().applyRemoteCollection(collection, [payload]);
    });
    return () => {
      unsubVisitors();
      unsubRecords();
    };
  }, []);

  return (
    <>
      <ToastHost />
      <CriticalAlertOverlay />
      <AppRoutes />
    </>
  );
}
