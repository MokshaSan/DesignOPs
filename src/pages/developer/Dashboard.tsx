import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Gauge,
  Info,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { StatTile } from "@/components/ui/StatTile";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { ADOPTION_DATA, PORTFOLIO_ENERGY, PROPERTIES } from "@/data/seed";
import { EnergyChart } from "@/components/charts/EnergyChart";
import { ENERGY_WEEK } from "@/data/seed";
import { TIER_LABEL, TIER_PERMISSIONS } from "@/data/permissions";
import { useStore } from "@/store/useStore";
import type { ResidentTier } from "@/types";

export function DeveloperDashboard() {
  const properties = useStore((state) => state.properties);
  const totalUnits = properties.reduce((s, p) => s + p.units, 0);
  const avgUptime = properties.length ? Math.round(properties.reduce((s, p) => s + p.uptime, 0) / properties.length) : 0;
  const avgEngagement = properties.length ? Math.round(properties.reduce((s, p) => s + p.engagementScore, 0) / properties.length) : 0;
  const avgEnergyTrend = properties.length ? Math.round(properties.reduce((s, p) => s + p.energyTrend, 0) / properties.length) : 0;

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
        <StatTile label="Properties" value={String(properties.length)} icon={Building2} tone="brand" />
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
          <CardTitle>Portfolio Energy Trend — This Week</CardTitle>
        </CardHeader>
        <EnergyChart data={ENERGY_WEEK} height={220} />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Future-ready living, built in</CardTitle>
              <p className="mt-1 text-xs text-tertiary">A connected experience buyers can feel beyond the finishes.</p>
            </div>
            <Badge tone="brand">Sales differentiator</Badge>
          </CardHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: Gauge, label: "Unified dashboard", text: "One view for home, building, and community services." },
              { icon: ShieldCheck, label: "Visitor management", text: "Secure digital access for guests and service teams." },
              { icon: Sparkles, label: "AI automation", text: "A home that learns routines and helps residents save." },
            ].map(({ icon: Icon, label, text }) => (
              <div key={label} className="rounded-xl bg-surface-raised p-4">
                <Icon size={18} className="text-brand-600" />
                <p className="mt-3 text-sm font-semibold text-primary">{label}</p>
                <p className="mt-1 text-xs leading-5 text-tertiary">{text}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Buyer value signal</CardTitle>
          </CardHeader>
          <p className="text-3xl font-bold text-primary">91%</p>
          <p className="mt-1 text-xs text-tertiary">Residents actively using at least one smart feature</p>
          <div className="mt-5 flex items-center gap-2 text-xs text-success">
            <TrendingUp size={14} /> Future-ready living adoption is growing
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>ROI dashboard</CardTitle>
              <p className="mt-1 text-xs text-tertiary">Operational impact across the portfolio this quarter.</p>
            </div>
            <CircleDollarSign size={18} className="text-success" />
          </CardHeader>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Maintenance cost avoided", value: "$18.4k", detail: "from predictive alerts", icon: Wrench },
              { label: "Remote diagnostics", value: "34", detail: "truck rolls avoided", icon: Activity },
              { label: "Energy savings", value: "12.8%", detail: "portfolio average", icon: Zap },
              { label: "Feature adoption", value: "91%", detail: "weekly active residents", icon: Users },
            ].map(({ label, value, detail, icon: Icon }) => (
              <div key={label} className="rounded-lg bg-surface-raised p-3">
                <Icon size={15} className="text-success" />
                <p className="mt-2 text-xl font-semibold text-primary">{value}</p>
                <p className="mt-1 text-xs font-medium text-secondary">{label}</p>
                <p className="mt-1 text-[11px] text-tertiary">{detail}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Resident adoption &amp; satisfaction</CardTitle>
              <p className="mt-1 text-xs text-tertiary">Usage trends that help teams improve the resident experience.</p>
            </div>
            <BarChart3 size={18} className="text-brand-600" />
          </CardHeader>
          <div className="space-y-3">
            {ADOPTION_DATA.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-secondary">{item.label}</span>
                  <span className="font-semibold text-primary">{item.value}%</span>
                </div>
                <Progress value={item.value} />
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="text-xs text-tertiary">Resident satisfaction</p>
              <p className="mt-1 text-lg font-semibold text-primary">4.6 / 5</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-tertiary">Tenant turnover</p>
              <p className="mt-1 text-lg font-semibold text-success">-8.2%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div>
              <CardTitle>Role-based customization</CardTitle>
              <p className="mt-1 text-xs text-tertiary">Rights stay aligned as residents change.</p>
            </div>
            <CheckCircle2 size={18} className="text-success" />
          </CardHeader>
          <div className="space-y-3">
            {(Object.keys(TIER_LABEL) as ResidentTier[]).map((tier) => (
              <div key={tier} className="flex items-center justify-between rounded-lg bg-surface-raised px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-primary">{TIER_LABEL[tier]}</p>
                  <p className="mt-0.5 text-[11px] text-tertiary">Automatic reassignment on tenancy change</p>
                </div>
                <Badge tone="success">{Object.values(TIER_PERMISSIONS[tier]).filter(Boolean).length}/5</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Portfolio benchmark</CardTitle>
              <p className="mt-1 text-xs text-tertiary">Compare energy efficiency, device health, and resident adoption.</p>
            </div>
            <ArrowRight size={18} className="text-tertiary" />
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-xs">
              <thead className="border-b border-border text-tertiary">
                <tr>
                  <th className="pb-3 font-medium">Property</th>
                  <th className="pb-3 font-medium">Energy</th>
                  <th className="pb-3 font-medium">Device health</th>
                  <th className="pb-3 text-right font-medium">Adoption</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => {
                  const energy = PORTFOLIO_ENERGY.find((item) => item.label === property.name.replace("The Meridian, ", ""))?.value ?? property.energyTrend;
                  return (
                    <tr key={property.id} className="border-b border-border last:border-0">
                      <td className="py-3 pr-3 font-medium text-primary">{property.name}</td>
                      <td className="py-3 text-success">{energy}%</td>
                      <td className="py-3 text-secondary">{property.uptime}%</td>
                      <td className="py-3 text-right font-semibold text-primary">{property.engagementScore}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
