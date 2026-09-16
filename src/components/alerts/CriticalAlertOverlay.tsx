import { useEffect } from "react";
import { AlertOctagon } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/Button";
import { startWarningSiren, stopWarningSiren } from "@/lib/sounds";

export function CriticalAlertOverlay() {
  const { alerts, role, accountUnitId, acknowledgeAlert } = useStore();
  const active = alerts.find((a) => {
    if (a.acknowledged || a.severity !== "critical") return false;
    if (a.broadcast) return true;
    if (role === "operator" || role === "developer") return true;
    return !a.unitId || a.unitId === accountUnitId;
  });

  useEffect(() => {
    if (active) startWarningSiren();
    else stopWarningSiren();
    return () => stopWarningSiren();
  }, [active?.id]);

  if (!active) return null;

  return (
    <div className="alert-flash fixed inset-0 z-[85] flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl border-2 border-white bg-neutral-950 p-8 text-center text-white shadow-[0_0_0_8px_rgba(255,255,255,0.18)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white">
          <AlertOctagon size={32} />
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.28em] text-red-200">
          {active.broadcast ? "Building-wide alarm" : "Building emergency"}
        </p>
        <h2 className="mt-2 text-3xl font-bold">{active.title}</h2>
        <p className="mt-2 text-sm text-white/90">{active.location}</p>
        {active.aiNote && <p className="mt-4 text-sm text-white/80">{active.aiNote}</p>}
        <Button
          className="mt-8 h-14 w-full rounded-full bg-white text-base font-bold uppercase tracking-wide text-red-700 shadow-lg ring-4 ring-white/50 hover:bg-red-50"
          onClick={() => acknowledgeAlert(active.id)}
        >
          Acknowledge alarm
        </Button>
      </div>
    </div>
  );
}
