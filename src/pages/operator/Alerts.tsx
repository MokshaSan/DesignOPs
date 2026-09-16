import { AlertTriangle, AlertOctagon, Info, Sparkles, Check } from "lucide-react";
import { SimulateAlertButton } from "@/components/alerts/SimulateAlertButton";
import { BroadcastFireButton } from "@/components/alerts/BroadcastFireButton";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/cx";

const SEVERITY_CONFIG = {
  critical: { icon: AlertOctagon, tone: "danger" as const, ring: "border-danger/40" },
  warning: { icon: AlertTriangle, tone: "warning" as const, ring: "border-warning/40" },
  info: { icon: Info, tone: "neutral" as const, ring: "border-border" },
};

export function OperatorAlerts() {
  const { alerts, acknowledgeAlert } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Active Alerts</h1>
          <p className="mt-1 text-sm text-tertiary">Live building events. Simulate a sensor event to warn the resident and operations together.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SimulateAlertButton />
          <BroadcastFireButton />
        </div>
      </div>

      <div className="space-y-3">
        {alerts.length === 0 && (
          <Card className="text-center text-sm text-tertiary">No live alerts. Use Simulate alert to fire a sensor event.</Card>
        )}
        {alerts.map((a) => {
          const cfg = SEVERITY_CONFIG[a.severity];
          const Icon = cfg.icon;
          return (
            <Card key={a.id} className={cx("border", cfg.ring, a.acknowledged && "opacity-60")}>
              <div className="flex items-start gap-3">
                <div
                  className={cx(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    a.severity === "critical" ? "bg-danger/10" : a.severity === "warning" ? "bg-warning/10" : "bg-surface-raised",
                  )}
                >
                  <Icon size={18} className={a.severity === "critical" ? "text-danger" : a.severity === "warning" ? "text-warning" : "text-tertiary"} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-primary">{a.title}</p>
                    <Badge tone={cfg.tone} className="capitalize">
                      {a.severity}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-tertiary">
                    {a.location} · {a.time}
                  </p>
                  {a.aiNote && (
                    <div className="mt-2.5 rounded-lg bg-brand-50 p-3 text-xs leading-relaxed text-brand-800 dark:bg-brand-900/20 dark:text-brand-300">
                      <p className="mb-1 flex items-center gap-1.5 font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-400">
                        <Sparkles size={11} /> AI Analysis {a.aiConfidence && `· ${a.aiConfidence}% confidence`}
                      </p>
                      {a.aiNote}
                    </div>
                  )}
                  {!a.acknowledged && (
                    <Button size="sm" variant="outline" className="mt-3" onClick={() => acknowledgeAlert(a.id)}>
                      <Check size={13} /> Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
