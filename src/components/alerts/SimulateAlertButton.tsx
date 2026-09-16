import { useState } from "react";
import { Siren } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/store/useStore";
import type { AlertItem } from "@/types";

export function SimulateAlertButton() {
  const addAlert = useStore((s) => s.addAlert);
  const unitId = useStore((s) => s.accountUnitId) || "W001";
  const [open, setOpen] = useState(false);

  const scenarios: Omit<AlertItem, "id" | "time" | "acknowledged">[] = [
    {
      severity: "critical",
      kind: "smoke",
      title: "Smoke detected",
      location: `Tower A · ${unitId} · Living Room`,
      unitId,
      aiConfidence: 91,
      aiNote: "Smoke density rising on the living-room sensor. Evacuate the unit and wait for operations.",
    },
    {
      severity: "warning",
      kind: "heat",
      title: "Temperature spike",
      location: `Tower A · ${unitId} · Bedroom`,
      unitId,
      aiConfidence: 82,
      aiNote: "Bedroom air is 4°C above the usual evening range. Check AC or an open window.",
    },
    {
      severity: "critical",
      kind: "leak",
      title: "Water leak detected",
      location: `Tower A · ${unitId} · Kitchen`,
      unitId,
      aiConfidence: 88,
      aiNote: "Moisture under the kitchen sink. Shut the isolation valve if safe to do so.",
    },
    {
      severity: "warning",
      kind: "motion",
      title: "Unexpected motion",
      location: `Tower A · ${unitId} · Entrance`,
      unitId,
      aiConfidence: 74,
      aiNote: "Motion at the front door while the unit is marked away. Confirm if a visitor was expected.",
    },
    {
      severity: "warning",
      kind: "power",
      title: "Power flicker",
      location: `Tower A · ${unitId} riser`,
      unitId,
      aiConfidence: 70,
      aiNote: "Short voltage dip on this floor circuit. Devices may have restarted.",
    },
  ];

  return (
    <div className="relative">
      <Button size="sm" variant="outline" onClick={() => setOpen((v) => !v)}>
        <Siren size={14} /> Simulate alert
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-20 w-64 overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
            {scenarios.map((s) => (
              <button
                key={s.kind}
                className="flex w-full flex-col items-start px-3 py-2.5 text-left hover:bg-surface-raised"
                onClick={() => {
                  addAlert(s);
                  setOpen(false);
                }}
              >
                <span className="text-sm font-semibold text-primary">{s.title}</span>
                <span className="text-[11px] capitalize text-tertiary">{s.severity} · {unitId}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
