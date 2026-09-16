import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import { Badge } from "@/components/ui/Badge";
import { TIER_DESCRIPTION, TIER_LABEL, TIER_PERMISSIONS } from "@/data/permissions";
import type { ResidentTier } from "@/types";

const FEATURES = ["Smart Locks", "Lighting", "AC", "Curtains", "Energy Monitoring", "Visitor Access"];

export function DeveloperConfiguration() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(Object.fromEntries(FEATURES.map((f) => [f, true])));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Property Configuration</h1>
        <p className="mt-1 text-sm text-tertiary">Define which systems are active for The Meridian, Tower A and the roles that can use them.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enabled Systems</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f} className="flex items-center justify-between rounded-lg bg-surface-raised px-4 py-3">
              <span className="text-sm text-secondary">{f}</span>
              <Toggle checked={enabled[f]} onChange={(v) => setEnabled((s) => ({ ...s, [f]: v }))} size="sm" aria-label={f} />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resident Roles &amp; Permissions</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {(Object.keys(TIER_LABEL) as ResidentTier[]).map((tier) => (
            <div key={tier} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-primary">{TIER_LABEL[tier]}</p>
                <Badge tone="brand">{Object.values(TIER_PERMISSIONS[tier]).filter(Boolean).length} / 5 permissions</Badge>
              </div>
              <p className="mt-1 text-xs text-tertiary">{TIER_DESCRIPTION[tier]}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {Object.entries(TIER_PERMISSIONS[tier]).map(([key, val]) => (
                  <Badge key={key} tone={val ? "success" : "neutral"} className="capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
