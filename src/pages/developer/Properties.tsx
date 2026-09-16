import { Building2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { PROPERTIES } from "@/data/seed";

export function DeveloperProperties() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">My Properties</h1>
        <p className="mt-1 text-sm text-tertiary">Portfolio of John Keells developments running Smart Living OS.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PROPERTIES.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:text-brand-900">
                <Building2 size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-primary">{p.name}</p>
                <p className="text-xs text-tertiary">{p.developer}</p>
                <p className="mt-1 text-xs text-tertiary">{p.units} units</p>
              </div>
              <Badge tone={p.energyTrend < -10 ? "success" : "brand"}>{p.energyTrend}% energy</Badge>
            </div>
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-tertiary">Device uptime</span>
                <span className="font-semibold text-primary">{p.uptime}%</span>
              </div>
              <Progress value={p.uptime} tone={p.uptime > 95 ? "success" : "brand"} />
            </div>
            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-tertiary">Resident engagement</span>
                <span className="font-semibold text-primary">{p.engagementScore}%</span>
              </div>
              <Progress value={p.engagementScore} tone="brand" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
