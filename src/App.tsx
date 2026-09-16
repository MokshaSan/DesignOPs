import { useEffect } from "react";
import { AppRoutes } from "@/routes/AppRoutes";
import { useThemeSync } from "@/hooks/useThemeSync";
import { useSimulatedTelemetry } from "@/hooks/useSimulatedTelemetry";
import { fetchVisitorRequests } from "@/lib/visitors";
import { fetchRecords, seedCollection } from "@/lib/persist";
import { useStore } from "@/store/useStore";
import type { ServiceRequest } from "@/types";

export default function App() {
  useThemeSync();
  useSimulatedTelemetry();

  useEffect(() => {
    void (async () => {
      const state = useStore.getState();
      const visitors = await fetchVisitorRequests();
      if (visitors.length) state.mergeVisitors(visitors);

      const remoteServices = await fetchRecords<ServiceRequest>("service_requests");
      if (remoteServices.length) {
        state.mergeServiceRequests(remoteServices);
      } else {
        await seedCollection("service_requests", state.serviceRequests);
        await seedCollection("service_tickets", state.tickets);
        await seedCollection("invoices", state.invoices);
        await seedCollection("notices", state.notices);
        await seedCollection("facility_bookings", state.bookings);
        await seedCollection("devices", state.devices);
        await seedCollection("maintenance_items", state.maintenance);
        await seedCollection("alerts", state.alerts);
        await seedCollection("floor_units", state.floorUnits);
        await seedCollection("floor_amenities", state.floorAmenities);
      }
    })();
  }, []);

  return <AppRoutes />;
}
