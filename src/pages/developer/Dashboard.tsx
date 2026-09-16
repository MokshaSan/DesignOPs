import { Building2, Users, TrendingDown, TrendingUp, Activity, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { StatTile } from "@/components/ui/StatTile";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { PROPERTIES } from "@/data/seed";
import { EnergyChart } from "@/components/charts/EnergyChart";
import { ENERGY_WEEK } from "@/data/seed";

export function DeveloperDashboard() {
  const totalUnits = PROPERTIES.reduce((s, p) => s + p.units, 0);
  const avgUptime = Math.round(PROPERTIES.reduce((s, p) => s + p.uptime, 0) / PROPERTIES.length);
  const avgEngagement = Math.round(PROPERTIES.reduce((s, p) => s + p.engagementScore, 0) / PROPERTIES.length);
  const avgEnergyTrend = Math.round(PROPERTIES.reduce((s, p) => s + p.energyTrend, 0) / PROPERTIES.length);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Portfolio Overview</h1>
          <p className="mt-1 text-sm text-tertiary">John Keells Properties · Smart Living OS</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-surface-raised px-3 py-1.5 text-xs text-tertiary">
          <Info size={12} /> Illustrative demo metrics
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Properties" value={String(PROPERTIES.length)} icon={Building2} tone="brand" />
        <StatTile label="Total Units" value={totalUnits.toLocaleString()} icon={Users} tone="brand" />
        <StatTile label="Resident Engagement" value={`${avgEngagement}%`} icon={Activity} tone="success" />
        <StatTile label="Device Uptime" value={`${avgUptime}%`} icon={TrendingUp} tone="success" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Energy Consumption</CardTitle>
          </CardHeader>
          <p className="text-3xl font-bold text-success">{avgEnergyTrend}%</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-tertiary">
            <TrendingDown size={12} className="text-success" /> Portfolio average, vs. pre-platform baseline
          </p>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reactive Maintenance</CardTitle>
          </CardHeader>
          <p className="text-3xl font-bold text-success">-21%</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-tertiary">
            <TrendingDown size={12} className="text-success" /> Shift toward predictive scheduling
          </p>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Truck Rolls Avoided</CardTitle>
          </CardHeader>
          <p className="text-3xl font-bold text-primary">34</p>
          <p className="mt-1 text-xs text-tertiary">This quarter, across all properties</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collections snapshot</CardTitle>
          <Link to="/developer/collections" className="text-xs font-medium text-brand-700 hover:underline dark:text-brand-400">
            Open ledger
          </Link>
        </CardHeader>
        <p className="text-sm text-secondary">Rent and service-charge status for occupied units, including Meridian 12A.</p>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Energy Trend — This Week</CardTitle>
        </CardHeader>
        <EnergyChart data={ENERGY_WEEK} height={220} />
      </Card>
    </div>
  );
}
