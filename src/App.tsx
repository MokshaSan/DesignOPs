import { useEffect } from "react";
import { AppRoutes } from "@/routes/AppRoutes";
import { useThemeSync } from "@/hooks/useThemeSync";
import { useSimulatedTelemetry } from "@/hooks/useSimulatedTelemetry";
import { fetchVisitorRequests } from "@/lib/visitors";
import { useStore } from "@/store/useStore";

export default function App() {
  useThemeSync();
  useSimulatedTelemetry();

  useEffect(() => {
    void fetchVisitorRequests().then((rows) => {
      if (rows.length) useStore.getState().mergeVisitors(rows);
    });
  }, []);

  return <AppRoutes />;
}
