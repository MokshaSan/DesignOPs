import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Thermometer, Lightbulb, Lock, Zap, ChevronRight, Sparkles, Wrench, CreditCard, Megaphone, CalendarClock, MessageSquareWarning } from "lucide-react";
import { StatTile } from "@/components/ui/StatTile";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { DeviceTile } from "@/components/devices/DeviceTile";
import { getIcon } from "@/lib/icons";
import { SimulateAlertButton } from "@/components/alerts/SimulateAlertButton";
import { LiveAISuggestion } from "@/components/ai/LiveAISuggestion";
import { AIAutomationCard } from "@/components/ai/AIAutomationCard";
import { useStore, useResidentDevices, useResidentScenes } from "@/store/useStore";
import { Badge } from "@/components/ui/Badge";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 18) return "Good Afternoon";
  return "Good Evening";
}

export function ResidentDashboard() {
  const { activityLog, visitors, runScene, accountName, accountUnitId } = useStore();
  const devices = useResidentDevices();
  const scenes = useResidentScenes();

  const lights = devices.filter((d) => d.kind === "light");
  const ac = devices.find((d) => d.kind === "ac" && d.room === "Living Room");
  const door = devices.find((d) => d.kind === "door");
  const lightsOn = lights.filter((l) => l.power).length;
  const quickDevices = devices.filter((d) => d.kind !== "sensor").slice(0, 8);
  const pendingVisitor = visitors.find((v) => v.status === "pending" && v.unitId === accountUnitId);

  const energyToday = useMemo(() => 4.2, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-tertiary">Tower A · {accountUnitId}</p>
          <h1 className="text-2xl font-bold text-primary md:text-3xl">
            {greeting()}, {accountName.split(" ")[0]}
          </h1>
        </div>
        <SimulateAlertButton />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { to: "/resident/maintenance", label: "Maintenance", hint: "Submit work", icon: Wrench },
          { to: "/resident/payments", label: "Payments", hint: "Rent & dues", icon: CreditCard },
          { to: "/resident/complaints", label: "Complaints", hint: "Track tickets", icon: MessageSquareWarning },
          { to: "/resident/community", label: "Community", hint: "Notices", icon: Megaphone },
          { to: "/resident/bookings", label: "Bookings", hint: "Gym · BBQ · hall", icon: CalendarClock },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group rounded-2xl border border-border bg-surface p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
          >
            <item.icon size={18} className="text-brand-600" />
            <p className="mt-3 text-sm font-semibold text-primary">{item.label}</p>
            <p className="text-[11px] text-tertiary">{item.hint}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Living Room" value={`${ac?.value ?? 24}°C`} icon={Thermometer} tone="brand" />
        <StatTile label="Lights On" value={`${lightsOn} of ${lights.length}`} icon={Lightbulb} tone="warning" />
        <StatTile label="Front Door" value={door?.power ? "Locked" : "Unlocked"} icon={Lock} tone={door?.power ? "success" : "danger"} />
        <StatTile label="Energy Today" value={`${energyToday} kWh`} icon={Zap} tone="brand" trend={{ value: "↓ 6% vs yesterday", positive: true }} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <LiveAISuggestion />
          <AIAutomationCard context="home dashboard scenes, lights, AC, and arrival" />

          <Card>
            <CardHeader>
              <CardTitle>Quick Controls</CardTitle>
              <Link to="/resident/devices" className="flex items-center gap-1 text-xs font-medium text-brand-700 hover:underline dark:text-brand-400">
                All devices <ChevronRight size={13} />
              </Link>
            </CardHeader>
            {quickDevices.length === 0 ? (
              <p className="text-sm text-tertiary">
                No devices in {accountUnitId}.{" "}
                <Link to="/resident/devices" className="font-medium text-brand-700 hover:underline dark:text-brand-400">
                  Add lights, AC, or locks
                </Link>
                .
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {quickDevices.map((d) => (
                  <DeviceTile key={d.id} device={d} />
                ))}
              </div>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scenes</CardTitle>
              <Link to="/resident/scenes" className="flex items-center gap-1 text-xs font-medium text-brand-700 hover:underline dark:text-brand-400">
                Manage <ChevronRight size={13} />
              </Link>
            </CardHeader>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {scenes.slice(0, 6).map((s) => {
                const Icon = getIcon(s.icon);
                return (
                  <button
                    key={s.id}
                    onClick={() => runScene(s.id)}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-surface-raised p-4 text-center transition-colors hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/20"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700 transition-transform group-hover:scale-110 dark:text-brand-900">
                      <Icon size={18} />
                    </div>
                    <span className="text-xs font-medium text-primary">{s.name}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {pendingVisitor && (
            <Card className="border-brand-200 dark:border-brand-800/60">
              <CardHeader>
                <CardTitle>Visitor Request</CardTitle>
                <Badge tone={pendingVisitor.riskLevel === "low" ? "success" : "warning"}>{pendingVisitor.riskLevel} risk</Badge>
              </CardHeader>
              <p className="text-sm font-semibold text-primary">{pendingVisitor.name}</p>
              <p className="text-xs text-tertiary capitalize">
                {pendingVisitor.type} · {pendingVisitor.windowStart}–{pendingVisitor.windowEnd} today
              </p>
              <p className="mt-2 text-xs text-secondary">{pendingVisitor.riskReason}</p>
              <Link to="/resident/visitors">
                <Button size="sm" className="mt-3 w-full">
                  Review request
                </Button>
              </Link>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <ul className="space-y-3">
              {activityLog.slice(0, 8).map((a) => (
                <li key={a.id} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  <div>
                    <p className="text-secondary">{a.text}</p>
                    <p className="text-[11px] text-tertiary">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="bg-gradient-to-br from-brand-700 to-brand-900 text-white dark:from-brand-300 dark:to-brand-200">
            <div className="flex items-center gap-2">
              <Sparkles size={16} />
              <p className="text-sm font-semibold">Ask Nestura</p>
            </div>
            <p className="mt-2 text-xs text-white/80">
              Need directions to the gym, pool, or parking? Tap the assistant button in the corner — Nestura knows the
              full building layout.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
