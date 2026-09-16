import { Toggle } from "@/components/ui/Toggle";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { DEMO_ACCOUNTS } from "@/data/demoAccounts";
import { useStore } from "@/store/useStore";

export function HouseholdAccessPanel() {
  const { accountKey, accountUnitId, residentTier, householdAccess, setHouseholdAccess } = useStore();
  if (residentTier !== "owner") return null;
  const family = DEMO_ACCOUNTS.filter(
    (a) => a.role === "resident" && a.unitId === accountUnitId && a.key !== accountKey,
  );
  if (family.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Family access · {accountUnitId}</CardTitle>
      </CardHeader>
      <p className="mb-3 text-sm text-tertiary">
        You are the unit owner. Decide who in this household can grant visitors and unlock doors.
      </p>
      <div className="divide-y divide-border">
        {family.map((member) => {
          const allowed = householdAccess[member.key] ?? member.tier !== "tenant";
          return (
            <div key={member.key} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-semibold text-primary">{member.name}</p>
                <p className="text-xs text-tertiary">{member.label} · visitor grants {allowed ? "on" : "off"}</p>
              </div>
              <Toggle
                checked={allowed}
                onChange={(v) => setHouseholdAccess(member.key, v)}
                aria-label={`Access for ${member.name}`}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
