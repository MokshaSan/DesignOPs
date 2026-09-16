import { Sparkles, Wrench, Truck, ChevronRight, MapPin } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ServiceKind, ServiceRequest } from "@/types";

const SERVICES: { id: ServiceKind; name: string; icon: typeof Sparkles; desc: string }[] = [
  { id: "cleaning", name: "Cleaning", icon: Sparkles, desc: "Resident cleaning requests." },
  { id: "maintenance", name: "Maintenance", icon: Wrench, desc: "Household repair requests." },
  { id: "moving", name: "Moving Service", icon: Truck, desc: "Move-in / move-out coordination." },
];

const SERVICE_ICON: Record<ServiceKind, typeof Sparkles> = {
  cleaning: Sparkles,
  maintenance: Wrench,
  moving: Truck,
};

const STATUS_FLOW: ServiceRequest["status"][] = ["pending", "scheduled", "in-progress", "completed"];

const STATUS_LABEL: Record<ServiceRequest["status"], string> = {
  pending: "Pending",
  scheduled: "Scheduled",
  "in-progress": "In progress",
  completed: "Completed",
};

const STATUS_TONE: Record<ServiceRequest["status"], "warning" | "info" | "brand" | "success"> = {
  pending: "warning",
  scheduled: "info",
  "in-progress": "brand",
  completed: "success",
};

export function OperatorServices() {
  const { serviceRequests, updateServiceRequestStatus } = useStore();

  function advance(request: ServiceRequest) {
    const idx = STATUS_FLOW.indexOf(request.status);
    const next = STATUS_FLOW[Math.min(idx + 1, STATUS_FLOW.length - 1)];
    updateServiceRequestStatus(request.id, next);
  }

  const activeCount = (id: ServiceKind) =>
    serviceRequests.filter((r) => r.kind === id && r.status !== "completed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Resident Service Requests</h1>
        <p className="mt-1 text-sm text-tertiary">Cleaning, maintenance and moving requests raised by residents.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {SERVICES.map((s) => (
          <Card key={s.id} className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:text-brand-900">
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">{s.name}</p>
              <p className="mt-1 text-xs text-tertiary">{s.desc}</p>
            </div>
            <Badge tone={activeCount(s.id) ? "brand" : "neutral"}>
              {activeCount(s.id) ? `${activeCount(s.id)} active` : "No active requests"}
            </Badge>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        {serviceRequests.length === 0 && (
          <Card className="text-center text-sm text-tertiary">No service requests yet.</Card>
        )}
        {serviceRequests.map((r) => {
          const Icon = SERVICE_ICON[r.kind];
          return (
            <Card key={r.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:text-brand-900">
                  <Icon size={17} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-primary">{r.residentName}</p>
                    <Badge tone="neutral" className="capitalize">{r.kind}</Badge>
                    <Badge tone={STATUS_TONE[r.status]} dot className="capitalize">
                      {STATUS_LABEL[r.status]}
                    </Badge>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-secondary">
                    <MapPin size={11} /> Unit {r.unitId} · Requested {r.requestedAt} · {r.scheduledFor}
                  </p>
                  {r.notes && <p className="mt-1 text-xs text-tertiary">{r.notes}</p>}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={r.status}
                  onChange={(e) => updateServiceRequestStatus(r.id, e.target.value as ServiceRequest["status"])}
                  className="rounded-lg border border-border bg-bg px-2 py-1.5 text-xs text-primary"
                >
                  {STATUS_FLOW.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABEL[status]}
                    </option>
                  ))}
                </select>
                {r.status !== "completed" && (
                  <Button size="sm" variant="outline" onClick={() => advance(r)}>
                    Mark as {STATUS_FLOW[STATUS_FLOW.indexOf(r.status) + 1].replace("-", " ")} <ChevronRight size={13} />
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}