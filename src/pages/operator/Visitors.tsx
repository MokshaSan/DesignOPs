import { useMemo, useState } from "react";
import { useStore } from "@/store/useStore";
import { VisitorRequestCard } from "@/components/visitors/VisitorRequestCard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

const STATUSES = ["all", "pending", "approved", "revoked", "rejected", "expired", "checked-in"] as const;

export function OperatorVisitors() {
  const { visitors, activityLog } = useStore();
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");
  const [unit, setUnit] = useState("all");
  const [q, setQ] = useState("");

  const units = useMemo(() => Array.from(new Set(visitors.map((v) => v.unitId))).sort(), [visitors]);

  const filtered = visitors.filter((v) => {
    if (status !== "all" && v.status !== status) return false;
    if (unit !== "all" && v.unitId !== unit) return false;
    const hay = `${v.name} ${v.passCode} ${v.hostName ?? ""} ${v.unitId}`.toLowerCase();
    return hay.includes(q.trim().toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Visitor history</h1>
        <p className="mt-1 text-sm text-tertiary">Every request, grant, unlock and revoke across the tower.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, ID, host…"
          className="min-w-[12rem] flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-primary"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value as (typeof STATUSES)[number])} className="rounded-lg border border-border bg-bg px-3 py-2 text-sm text-primary">
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select value={unit} onChange={(e) => setUnit(e.target.value)} className="rounded-lg border border-border bg-bg px-3 py-2 text-sm text-primary">
          <option value="all">All units</option>
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((v) => (
          <VisitorRequestCard key={v.id} visitor={v} showUnit />
        ))}
        {filtered.length === 0 && <Card className="text-sm text-tertiary">No matching visitor records.</Card>}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-primary">Access log</h2>
        <div className="space-y-2">
          {activityLog
            .filter((row) => /visitor|pass|door|grant|deactivat|reactivat/i.test(row.text))
            .slice(0, 20)
            .map((row) => (
              <div key={row.id} className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm">
                <span className="text-secondary">{row.text}</span>
                <Badge tone="neutral">{row.time}</Badge>
              </div>
            ))}
          {activityLog.filter((row) => /visitor|pass|door/i.test(row.text)).length === 0 && (
            <p className="text-sm text-tertiary">Logs appear when residents grant, revoke, or visitors unlock doors.</p>
          )}
        </div>
      </div>
    </div>
  );
}
