import { useEffect } from "react";
import { useStore } from "@/store/useStore";

function hhmm() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** Fires enabled time-based automations when the clock matches their trigger. */
export function useAutomationEngine() {
  useEffect(() => {
    const tick = () => {
      const now = hhmm().slice(0, 5);
      const stamp = new Date().toISOString().slice(0, 16);
      const { automations, fireAutomation } = useStore.getState();
      for (const a of automations) {
        if (!a.enabled || a.trigger.type !== "time") continue;
        const match = a.trigger.label.match(/(\d{1,2}:\d{2})/);
        if (!match) continue;
        const [h, m] = match[1].split(":");
        const t = `${h.padStart(2, "0")}:${m}`;
        if (t === now && a.lastTriggered !== stamp) fireAutomation(a.id);
      }
    };
    tick();
    const id = window.setInterval(tick, 20000);
    return () => window.clearInterval(id);
  }, []);
}
