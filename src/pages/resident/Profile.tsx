import { Check, X, Lock } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useStore } from "@/store/useStore";
import { TIER_DESCRIPTION, TIER_LABEL, TIER_PERMISSIONS } from "@/data/permissions";
import type { ResidentTier } from "@/types";
import { cx } from "@/lib/cx";

const PERMISSION_LABELS: { key: keyof typeof TIER_PERMISSIONS.owner; label: string }[] = [
  { key: "smartHome", label: "Smart Home Control" },
  { key: "access", label: "Access & Visitor Management" },
  { key: "billing", label: "Billing & Payments" },
  { key: "services", label: "Building Services" },
  { key: "automation", label: "Automation" },
];

export function ResidentProfile() {
  const { residentTier, setResidentTier, accountName, accountUnitId } = useStore();
  const permissions = TIER_PERMISSIONS[residentTier];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Profile</h1>
        <p className="mt-1 text-sm text-tertiary">Your identity and role-based permissions on this property.</p>
      </div>

      <Card className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <Avatar name={accountName} size="lg" />
        <div>
          <p className="text-lg font-semibold text-primary">{accountName}</p>
          <p className="text-sm text-tertiary">Tower A · {accountUnitId}</p>
          <Badge tone="brand" className="mt-2">
            {TIER_LABEL[residentTier]}
          </Badge>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resident Tier (demo switch)</CardTitle>
        </CardHeader>
        <p className="mb-3 text-xs text-tertiary">
          Switch tiers to see how role-based access control changes what this resident can do — the same account, different rights.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(Object.keys(TIER_LABEL) as ResidentTier[]).map((tier) => (
            <button
              key={tier}
              onClick={() => setResidentTier(tier)}
              className={cx(
                "rounded-xl border p-4 text-left transition-colors",
                residentTier === tier ? "border-brand-400 bg-brand-50 dark:bg-brand-900/20" : "border-border hover:bg-surface-raised",
              )}
            >
              <p className={cx("text-sm font-semibold", residentTier === tier ? "text-brand-700 dark:text-brand-400" : "text-primary")}>
                {TIER_LABEL[tier]}
              </p>
              <p className="mt-1 text-xs text-tertiary">{TIER_DESCRIPTION[tier]}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
          <Lock size={15} className="text-tertiary" />
        </CardHeader>
        <div className="divide-y divide-border">
          {PERMISSION_LABELS.map((p) => {
            const allowed = permissions[p.key];
            return (
              <div key={p.key} className="flex items-center justify-between py-3">
                <span className="text-sm text-secondary">{p.label}</span>
                {allowed ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-success">
                    <Check size={13} /> Enabled
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-semibold text-tertiary">
                    <X size={13} /> Restricted
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
