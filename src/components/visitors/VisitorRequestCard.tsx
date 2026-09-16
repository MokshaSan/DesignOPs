import { Check, X, Clock, Package, HardHat, User as UserIcon, Wrench } from "lucide-react";
import type { VisitorRequest } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/cx";

const TYPE_ICON = { guest: UserIcon, delivery: Package, contractor: HardHat, service: Wrench };

const STATUS_TONE: Record<VisitorRequest["status"], "warning" | "success" | "danger" | "neutral"> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
  "checked-in": "success",
  expired: "neutral",
};

export function VisitorRequestCard({
  visitor,
  onApprove,
  onReject,
  showUnit,
}: {
  visitor: VisitorRequest;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  showUnit?: boolean;
}) {
  const Icon = TYPE_ICON[visitor.type];
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:text-brand-900">
            <Icon size={17} />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">{visitor.name}</p>
            <p className="text-xs capitalize text-tertiary">
              {visitor.type} {showUnit && `· Unit ${visitor.unitId}`}
            </p>
          </div>
        </div>
        <Badge tone={STATUS_TONE[visitor.status]} className="capitalize">
          {visitor.status}
        </Badge>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-secondary">
        <Clock size={12} /> {visitor.requestedFor}, {visitor.windowStart}–{visitor.windowEnd}
      </div>

      <div className={cx("rounded-lg p-2.5 text-xs", visitor.riskLevel === "low" ? "bg-success/10 text-success" : visitor.riskLevel === "medium" ? "bg-warning/10 text-warning" : "bg-danger/10 text-danger")}>
        <span className="font-semibold uppercase tracking-wide">{visitor.riskLevel} risk</span> · {visitor.riskReason}
      </div>

      {visitor.status === "pending" && (onApprove || onReject) && (
        <div className="flex gap-2">
          {onApprove && (
            <Button size="sm" className="flex-1" onClick={() => onApprove(visitor.id)}>
              <Check size={13} /> Approve
            </Button>
          )}
          {onReject && (
            <Button size="sm" variant="outline" className="flex-1" onClick={() => onReject(visitor.id)}>
              <X size={13} /> Reject
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
