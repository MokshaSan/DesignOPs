import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { ADOPTION_DATA, PORTFOLIO_ENERGY } from "@/data/seed";

export function DeveloperAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Analytics</h1>
        <p className="mt-1 text-sm text-tertiary">Feature adoption, energy trends, and operational impact across the portfolio.</p>
      </div>

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
          <CardTitle>Operational Impact</CardTitle>
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
        <p className="mt-4 text-[11px] text-tertiary">All figures are illustrative / simulated for this prototype.</p>
      </Card>
    </div>
  );
}
