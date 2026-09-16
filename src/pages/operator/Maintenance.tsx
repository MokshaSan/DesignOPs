import { Wrench, ChevronRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { MaintenanceItem } from "@/types";

const RISK_TONE: Record<MaintenanceItem["risk"], "danger" | "warning" | "success"> = {
  critical: "danger",
  high: "danger",
  medium: "warning",
  low: "success",
};

const STATUS_FLOW: MaintenanceItem["status"][] = ["predicted", "scheduled", "in-progress", "resolved"];

export function OperatorMaintenance() {
  const { maintenance, updateMaintenanceStatus } = useStore();

  function advance(item: MaintenanceItem) {
    const idx = STATUS_FLOW.indexOf(item.status);
    const next = STATUS_FLOW[Math.min(idx + 1, STATUS_FLOW.length - 1)];
    updateMaintenanceStatus(item.id, next);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Predictive Maintenance</h1>
        <p className="mt-1 text-sm text-tertiary">AI-flagged devices, ranked by predicted failure risk.</p>
      </div>

      <div className="space-y-3">
        {maintenance.map((m) => (
          <Card key={m.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:text-brand-900">
                <Wrench size={17} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-primary">{m.deviceName}</p>
                  <Badge tone={RISK_TONE[m.risk]} className="capitalize">
                    {m.risk} risk
                  </Badge>
                  <Badge tone="neutral" className="capitalize">
                    {m.status.replace("-", " ")}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-secondary">{m.reason}</p>
                <p className="mt-1 text-[11px] text-tertiary">Predicted window: {m.predictedWindow}</p>
              </div>
            </div>
            {m.status !== "resolved" && (
              <Button size="sm" variant="outline" onClick={() => advance(m)}>
                Mark as {STATUS_FLOW[STATUS_FLOW.indexOf(m.status) + 1].replace("-", " ")} <ChevronRight size={13} />
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
