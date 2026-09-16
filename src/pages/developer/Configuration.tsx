import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import { Badge } from "@/components/ui/Badge";
import type { Role } from "@/types";

const FEATURES = ["Smart Locks", "Lighting", "AC", "Curtains", "Energy Monitoring", "Visitor Access"];

const USERS = [
  { id: "user-1", name: "Alex Perera", unit: "12A", role: "resident" as const },
  { id: "user-2", name: "Maya Silva", unit: "8F", role: "operator" as const },
  { id: "user-3", name: "Daniel Wong", unit: "18B", role: "visitor" as const },
];

const USER_ROLES: Array<{ value: Extract<Role, "resident" | "visitor" | "operator">; label: string }> = [
  { value: "resident", label: "Resident" },
  { value: "visitor", label: "Visitor" },
  { value: "operator", label: "Building Operator" },
];

export function DeveloperConfiguration() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(Object.fromEntries(FEATURES.map((f) => [f, true])));
  const [userRoles, setUserRoles] = useState<Record<string, (typeof USER_ROLES)[number]["value"]>>(Object.fromEntries(USERS.map((user) => [user.id, user.role])));

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
          <div>
            <CardTitle>Assign user roles</CardTitle>
            <p className="mt-1 text-xs text-tertiary">Update access as users move between resident, visitor, and building operator roles.</p>
          </div>
          <Badge tone="success">Auto reassignment enabled</Badge>
        </CardHeader>
        <div className="space-y-2">
          {USERS.map((user) => (
            <div key={user.id} className="flex flex-col gap-3 rounded-lg bg-surface-raised px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-primary">{user.name}</p>
                <p className="mt-0.5 text-xs text-tertiary">Unit {user.unit}</p>
              </div>
              <select value={userRoles[user.id]} onChange={(event) => setUserRoles((roles) => ({ ...roles, [user.id]: event.target.value as (typeof USER_ROLES)[number]["value"] }))} aria-label={`Role for ${user.name}`} className="h-9 rounded-lg border border-border bg-surface px-3 text-sm text-primary outline-none focus:border-brand-500">
                {USER_ROLES.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
              </select>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
