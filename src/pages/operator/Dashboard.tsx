import { Building2, Users, Wrench, Zap, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { StatTile } from "@/components/ui/StatTile";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useStore } from "@/store/useStore";
import { EnergyChart } from "@/components/charts/EnergyChart";
import { ENERGY_WEEK } from "@/data/seed";
import { Link } from "react-router-dom";

export function OperatorDashboard() {
  const { devices, visitors, maintenance, alerts, tickets } = useStore();
  const online = devices.filter((d) => d.status === "online").length;
  const warning = devices.filter((d) => d.status === "warning").length;
  const offline = devices.filter((d) => d.status === "offline").length;
  const activeVisitors = visitors.filter((v) => v.status === "approved" || v.status === "checked-in").length;
  const openMaintenance = maintenance.filter((m) => m.status !== "resolved").length + tickets.filter((t) => t.status !== "resolved").length;
  const criticalAlerts = alerts.filter((a) => a.severity === "critical" && !a.acknowledged);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Building Overview</h1>
        <p className="mt-1 text-sm text-tertiary">The Meridian, Tower A · John Keells Properties</p>
      </div>

      {criticalAlerts.length > 0 && (
        <Card className="flex items-center gap-3 border-danger/40 bg-danger/5">
          <AlertTriangle size={18} className="shrink-0 text-danger" />
          <p className="text-sm text-danger">
            <strong>{criticalAlerts.length} critical alert{criticalAlerts.length > 1 ? "s" : ""}</strong> needs attention.
          </p>
          <Link to="/operator/alerts" className="ml-auto text-xs font-semibold text-danger hover:underline">
            View
          </Link>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Total Units" value="420" icon={Building2} tone="brand" />
        <StatTile label="Active Visitors" value={String(activeVisitors)} icon={Users} tone="success" />
        <StatTile label="Open work" value={String(openMaintenance)} icon={Wrench} tone="warning" />
        <StatTile label="Energy Today" value="2,481 kWh" icon={Zap} tone="brand" trend={{ value: "↓ 5% vs yesterday", positive: true }} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Device Health</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-surface-raised p-3">
              <span className="flex items-center gap-2 text-sm text-secondary">
                <CheckCircle2 size={15} className="text-success" /> Online
              </span>
              <span className="text-sm font-semibold text-primary">{online}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-surface-raised p-3">
              <span className="flex items-center gap-2 text-sm text-secondary">
                <AlertTriangle size={15} className="text-warning" /> Warning
              </span>
              <span className="text-sm font-semibold text-primary">{warning}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-surface-raised p-3">
              <span className="flex items-center gap-2 text-sm text-secondary">
                <XCircle size={15} className="text-danger" /> Offline
              </span>
              <span className="text-sm font-semibold text-primary">{offline}</span>
            </div>
          </div>
          <Link to="/operator/devices">
            <Badge tone="brand" className="mt-4 w-full justify-center py-2">
              View full fleet
            </Badge>
          </Link>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Portfolio Energy — This Week</CardTitle>
          </CardHeader>
          <EnergyChart data={ENERGY_WEEK} height={200} />
        </Card>
      </div>
    </div>
  );
}
