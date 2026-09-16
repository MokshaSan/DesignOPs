import { useEffect } from "react";
import { useStore } from "@/store/useStore";

/**
 * Lightweight "device simulator" heartbeat — jitters a couple of sensor
 * readings periodically so the fleet feels alive without touching anything
 * a demo flow depends on (scenes/automations remain deterministic).
 */
export function useSimulatedTelemetry() {
  useEffect(() => {
    const interval = setInterval(() => {
      useStore.setState((s) => ({
        devices: s.devices.map((d) => {
          if (d.kind !== "sensor" || d.value === undefined) return d;
          const drift = Math.round((Math.random() - 0.5) * 6);
          const value = Math.max(0, Math.min(100, d.value + drift));
          return { ...d, value, lastHeartbeat: "just now" };
        }),
      }));
    }, 9000);
    return () => clearInterval(interval);
  }, []);
}
