import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { AIInsightCard } from "@/components/ai/AIInsightCard";
import { LiveAISuggestion } from "@/components/ai/LiveAISuggestion";
import { AIAutomationCard } from "@/components/ai/AIAutomationCard";
import { ADOPTION_DATA, ENERGY_WEEK, PORTFOLIO_ENERGY } from "@/data/seed";
import { useAIAnalytics } from "@/hooks/useAI";
import { nesturaSourceTitle } from "@/lib/aiLabel";
import { useStore } from "@/store/useStore";

export function DeveloperAnalytics() {
  const { devices, visitors, alerts } = useStore();
  const { run, loading } = useAIAnalytics();
  const [ai, setAi] = useState<{ headline: string; bullets: string[]; risk: string; source: string } | null>(null);

  useEffect(() => {
    void run({
      energyWeek: ENERGY_WEEK,
      devices: devices.map((d) => ({ name: d.name, status: d.status, unitId: d.unitId, battery: d.battery })),
      visitors: visitors.map((v) => ({ name: v.name, status: v.status, unitId: v.unitId })),
      alerts: alerts.filter((a) => !a.acknowledged).map((a) => ({ title: a.title, severity: a.severity })),
    }).then((r) => r && setAi(r));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devices.length, visitors.length, alerts.length]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Analytics</h1>
        <p className="mt-1 text-sm text-tertiary">
          Nestura over live app state. Energy series below are a seed profile, not meters.
        </p>
      </div>

      <LiveAISuggestion />
      <AIAutomationCard context="portfolio energy, visitor flow, and device health" />

      {loading && !ai && (
        <Card className="flex items-center gap-2 text-sm text-tertiary">
          <Loader2 size={16} className="animate-spin" /> Reading live portfolio signals…
        </Card>
      )}

      {ai && (
        <AIInsightCard title={nesturaSourceTitle(ai.source, "Portfolio")}>
          <p className="font-medium text-primary">{ai.headline}</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {(ai.bullets || []).map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <Badge className="mt-3" tone={ai.risk === "elevated" ? "warning" : "success"}>
            Risk {ai.risk}
          </Badge>
        </AIInsightCard>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resident Feature Adoption</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {ADOPTION_DATA.map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-secondary">{item.label}</span>
                  <span className="font-semibold text-primary">{item.value}%</span>
                </div>
                <Progress value={item.value} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Energy Reduction by Property</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {PORTFOLIO_ENERGY.map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-secondary">{item.label}</span>
                  <span className="font-semibold text-success">{item.value}%</span>
                </div>
                <Progress value={Math.abs(item.value)} max={20} tone="success" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles size={16} /> Operational Impact
          </CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-surface-raised p-4">
            <p className="text-xs text-tertiary">Maintenance Model</p>
            <p className="mt-2 text-sm text-tertiary">
              Before: <Badge tone="danger">Reactive</Badge>
            </p>
            <p className="mt-1.5 text-sm text-tertiary">
              Now: <Badge tone="success">Predictive</Badge>
            </p>
          </div>
          <div className="rounded-xl bg-surface-raised p-4">
            <p className="text-xs text-tertiary">Truck Rolls Avoided</p>
            <p className="mt-2 text-2xl font-bold text-primary">34</p>
            <p className="mt-1 text-xs text-tertiary">Estimated, this quarter</p>
          </div>
          <div className="rounded-xl bg-surface-raised p-4">
            <p className="text-xs text-tertiary">Avg. Resident Engagement</p>
            <p className="mt-2 text-2xl font-bold text-primary">91%</p>
            <p className="mt-1 text-xs text-tertiary">Weekly active residents</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
