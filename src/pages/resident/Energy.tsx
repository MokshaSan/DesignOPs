import { useEffect, useState } from "react";
import { Zap, TrendingDown, Loader2 } from "lucide-react";
import { StatTile } from "@/components/ui/StatTile";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { EnergyChart } from "@/components/charts/EnergyChart";
import { AIInsightCard } from "@/components/ai/AIInsightCard";
import { AIAutomationCard } from "@/components/ai/AIAutomationCard";
import { Button } from "@/components/ui/Button";
import { useAIEnergyInsight } from "@/hooks/useAI";
import { nesturaSourceTitle } from "@/lib/aiLabel";
import { ENERGY_TODAY, ENERGY_WEEK } from "@/data/seed";
import { useStore, useResidentDevices } from "@/store/useStore";

export function ResidentEnergy() {
  const { run, loading } = useAIEnergyInsight();
  const [insight, setInsight] = useState<{ insight: string; recommendation: string; contributorPct: number; source: string } | null>(null);
  const [applied, setApplied] = useState(false);
  const [editing, setEditing] = useState(false);
  const { setDeviceValue, addNotification } = useStore();
  const devices = useResidentDevices();

  useEffect(() => {
    run(ENERGY_TODAY, ENERGY_WEEK).then((r) => r && setInsight(r));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalToday = ENERGY_TODAY.reduce((s, p) => s + p.kwh, 0).toFixed(1);
  const totalWeek = ENERGY_WEEK.reduce((s, p) => s + p.kwh, 0).toFixed(1);

  function applyEnergySaver() {
    devices
      .filter((d) => d.kind === "ac" && d.power && d.value !== undefined)
      .forEach((d) => setDeviceValue(d.id, d.value! + 1));
    addNotification({
      icon: "Zap",
      title: "Energy Saver applied",
      body: "AC setpoints raised by 1°C during low-occupancy hours.",
      category: "energy",
    });
    setApplied(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Energy</h1>
        <p className="mt-1 text-sm text-tertiary">
          Seed profile (not a meter). Nestura still reads these kWh arrays plus your live AC state when you Apply Energy Saver.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Today" value={`${totalToday} kWh`} icon={Zap} tone="brand" />
        <StatTile label="This Week" value={`${totalWeek} kWh`} icon={Zap} tone="brand" />
        <StatTile label="Estimated Monthly" value="126 kWh" icon={TrendingDown} tone="success" />
        <StatTile label="vs. Last Month" value="↓ 11%" icon={TrendingDown} tone="success" trend={{ value: "Trending down", positive: true }} />
      </div>

      <AIAutomationCard context="energy saver AC and occupancy" />

      {loading && !insight && (
        <Card className="flex items-center gap-3 text-sm text-tertiary">
          <Loader2 size={16} className="animate-spin" /> Analyzing your energy patterns...
        </Card>
      )}

      {insight && (
        <AIInsightCard
          title={nesturaSourceTitle(insight.source, "Energy insight")}
          actions={
            <>
              <Button size="sm" onClick={applyEnergySaver} disabled={applied}>
                {applied ? "Applied ✓" : "Apply Energy Saver"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing((v) => !v)}>
                {editing ? "Done" : "Edit"}
              </Button>
            </>
          }
        >
          {editing ? (
            <textarea
              value={`${insight.insight}\n${insight.recommendation}`}
              onChange={(e) => {
                const [first, ...rest] = e.target.value.split("\n");
                setInsight({ ...insight, insight: first, recommendation: rest.join("\n") });
              }}
              className="mt-1 min-h-[88px] w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
            />
          ) : (
            <>
              <p>{insight.insight}</p>
              <p className="mt-1.5 text-secondary">{insight.recommendation}</p>
            </>
          )}
        </AIInsightCard>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Usage</CardTitle>
          </CardHeader>
          <p className="mb-3 text-xs text-tertiary">Seed hourly profile — not a live utility feed.</p>
          <EnergyChart data={ENERGY_TODAY} />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>This Week</CardTitle>
          </CardHeader>
          <p className="mb-3 text-xs text-tertiary">Seed weekly profile — not a live utility feed.</p>
          <EnergyChart data={ENERGY_WEEK} />
        </Card>
      </div>
    </div>
  );
}
