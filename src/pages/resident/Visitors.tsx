import { useState } from "react";
import { Users } from "lucide-react";
import { useStore } from "@/store/useStore";
import { VisitorRequestCard } from "@/components/visitors/VisitorRequestCard";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { PassQRCode } from "@/components/visitors/PassQRCode";
import { CURRENT_UNIT } from "@/data/seed";
import { TIER_PERMISSIONS } from "@/data/permissions";
import { RestrictedNotice } from "@/components/ui/RestrictedNotice";
import type { VisitorRequest } from "@/types";

export function ResidentVisitors() {
  const { visitors, approveVisitor, rejectVisitor, addNotification, residentTier } = useStore();
  const canManage = TIER_PERMISSIONS[residentTier].access;
  const mine = visitors.filter((v) => v.unitId === CURRENT_UNIT.id);
  const [showPassFor, setShowPassFor] = useState<VisitorRequest | null>(null);

  function handleApprove(id: string) {
    approveVisitor(id);
    const v = mine.find((x) => x.id === id);
    addNotification({ icon: "ShieldCheck", title: "Visitor approved", body: `${v?.name} can now enter.`, category: "visitor" });
    const updated = mine.find((x) => x.id === id);
    if (updated) setShowPassFor({ ...updated, status: "approved" });
  }

  function handleReject(id: string) {
    rejectVisitor(id);
  }

  const pending = mine.filter((v) => v.status === "pending");
  const others = mine.filter((v) => v.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Visitors</h1>
        <p className="mt-1 text-sm text-tertiary">Approve access requests and manage active passes for Unit {CURRENT_UNIT.label}.</p>
      </div>

      {pending.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-primary">Pending Requests</h2>
          {!canManage && (
            <div className="mb-3">
              <RestrictedNotice message="Your tenant tier can view visitor activity but can't approve or reject requests — that's managed by the unit owner." />
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pending.map((v) => (
              <VisitorRequestCard
                key={v.id}
                visitor={v}
                onApprove={canManage ? handleApprove : undefined}
                onReject={canManage ? handleReject : undefined}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-sm font-semibold text-primary">History &amp; Active Passes</h2>
        {others.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl2 border border-dashed border-border py-12 text-center">
            <Users size={24} className="text-tertiary" />
            <p className="text-sm text-tertiary">No other visitor activity yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((v) => (
              <button key={v.id} onClick={() => v.status === "approved" && setShowPassFor(v)} className="text-left">
                <VisitorRequestCard visitor={v} />
              </button>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!showPassFor} onClose={() => setShowPassFor(null)} title="Access Pass">
        {showPassFor && (
          <div className="flex flex-col items-center gap-4 text-center">
            <PassQRCode value={`${window.location.origin}/visitor/pass/${showPassFor.id}`} />
            <div>
              <p className="text-base font-semibold text-primary">{showPassFor.name}</p>
              <p className="text-xs capitalize text-tertiary">{showPassFor.type}</p>
            </div>
            <Badge tone="success">
              Valid {showPassFor.windowStart}–{showPassFor.windowEnd} today
            </Badge>
            <p className="text-xs text-tertiary">Code: {showPassFor.passCode}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
