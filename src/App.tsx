import { AppRoutes } from "@/routes/AppRoutes";
import { useThemeSync } from "@/hooks/useThemeSync";
import { useSimulatedTelemetry } from "@/hooks/useSimulatedTelemetry";

export default function App() {
  useThemeSync();
  useSimulatedTelemetry();
  return <AppRoutes />;
}
