import { useState } from "react";
import { Users } from "lucide-react";
import { useStore } from "@/store/useStore";
import { VisitorRequestCard } from "@/components/visitors/VisitorRequestCard";
import { AccessPassCard } from "@/components/visitors/AccessPassCard";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
  const [grantFor, setGrantFor] = useState<VisitorRequest | null>(null);
  const [grantDate, setGrantDate] = useState("");
  const [grantStart, setGrantStart] = useState("");
  const [grantEnd, setGrantEnd] = useState("");

  function openGrant(id: string) {
    const v = mine.find((x) => x.id === id);
    if (!v) return;
    setGrantFor(v);
    setGrantDate(v.requestedFor.includes("-") ? v.requestedFor : new Date().toISOString().slice(0, 10));
    setGrantStart(v.windowStart);
    setGrantEnd(v.windowEnd);
  }

  function confirmGrant() {
    if (!grantFor || grantStart >= grantEnd) return;
    approveVisitor(grantFor.id, { requestedFor: grantDate, windowStart: grantStart, windowEnd: grantEnd });
    addNotification({
      icon: "ShieldCheck",
      title: "Visitor approved",
      body: `${grantFor.name} can enter ${grantStart}–${grantEnd}.`,
      category: "visitor",
    });
    const issued = {
      ...grantFor,
      status: "approved" as const,
      requestedFor: grantDate,
      windowStart: grantStart,
      windowEnd: grantEnd,
    };
    setGrantFor(null);
    setShowPassFor(issued);
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
        <p className="mt-1 text-sm text-tertiary">
          Grant timed access for Unit {CURRENT_UNIT.id} — from this time to this time.
        </p>
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
                onApprove={canManage ? openGrant : undefined}
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

      <Modal open={!!grantFor} onClose={() => setGrantFor(null)} title="Grant timed access">
        {grantFor && (
          <div className="space-y-4">
            <p className="text-sm text-secondary">
              Set when <span className="font-semibold text-primary">{grantFor.name}</span> may enter Unit {grantFor.unitId}.
            </p>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-secondary">Date</label>
              <input
                type="date"
                value={grantDate}
                onChange={(e) => setGrantDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-secondary">From</label>
                <input
                  type="time"
                  value={grantStart}
                  onChange={(e) => setGrantStart(e.target.value)}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-secondary">To</label>
                <input
                  type="time"
                  value={grantEnd}
                  onChange={(e) => setGrantEnd(e.target.value)}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-primary"
                />
              </div>
            </div>
            <Button className="w-full" onClick={confirmGrant} disabled={!grantDate || grantStart >= grantEnd}>
              Issue digital access card
            </Button>
          </div>
        )}
      </Modal>

      <Modal open={!!showPassFor} onClose={() => setShowPassFor(null)} title="Digital access card">
        {showPassFor && (
          <div className="flex flex-col items-center gap-4">
            <AccessPassCard visitor={showPassFor} />
            <PassQRCode value={`${window.location.origin}/visitor/pass/${showPassFor.id}`} />
            <Badge tone="success">
              Valid {showPassFor.windowStart}–{showPassFor.windowEnd}
            </Badge>
          </div>
        )}
      </Modal>
    </div>
  );
}
