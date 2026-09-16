import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, ScanLine, XCircle } from "lucide-react";
import { useStore } from "@/store/useStore";
import { AccessPassCard } from "@/components/visitors/AccessPassCard";
import { PassQRCode } from "@/components/visitors/PassQRCode";
import { NesturaLockup } from "@/components/brand/NesturaMark";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BackButton } from "@/components/ui/BackButton";

function parseTimeToday(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function formatCountdown(ms: number) {
  if (ms <= 0) return "0:00";
  const totalSec = Math.floor(ms / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function VisitorPass() {
  const { id } = useParams();
  const { visitors, expireVisitor } = useStore();
  const visitor = visitors.find((v) => v.id === id);
  const [now, setNow] = useState(Date.now());
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const windowEnd = visitor ? parseTimeToday(visitor.windowEnd).getTime() : 0;
  const remaining = windowEnd - now;
  const isExpired = visitor?.status === "expired" || (visitor && remaining <= 0);

  useEffect(() => {
    if (visitor && remaining <= 0 && visitor.status !== "expired") {
      expireVisitor(visitor.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, visitor?.id]);

  const statusLabel = useMemo(() => {
    if (isExpired) return "Expired";
    if (scanned || visitor?.status === "checked-in") return "Checked In";
    if (visitor?.status === "approved") return "Valid Access";
    if (visitor?.status === "rejected") return "Access Denied";
    return "Pending Approval";
  }, [isExpired, scanned, visitor?.status]);

  if (!visitor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg p-6 text-center">
        <div>
          <BackButton to="/" className="mb-6" />
          <p className="text-lg font-semibold text-primary">Pass not found</p>
          <p className="mt-1 text-sm text-tertiary">This access pass doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg bg-noise p-6">
      <div className="mb-4 w-full max-w-sm">
        <BackButton to="/" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 text-center shadow-soft"
      >
        <NesturaLockup height={44} className="mx-auto" />
        <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-tertiary">Nestura Smart Living</p>
        <h1 className="mt-1 text-lg font-bold text-primary">Visitor Access</h1>

        <AccessPassCard visitor={visitor} />

        <div className="my-5 flex justify-center">
          {visitor.status === "rejected" || isExpired ? (
            <div className="flex items-center justify-center rounded-2xl border border-border bg-surface-raised" style={{ height: 200, width: 200 }}>
              <XCircle size={48} className="text-tertiary" />
            </div>
          ) : (
            <PassQRCode value={`${window.location.origin}/visitor/pass/${visitor.id}`} size={180} />
          )}
        </div>

        <Badge
          tone={statusLabel === "Valid Access" ? "success" : statusLabel === "Checked In" ? "brand" : statusLabel === "Expired" || statusLabel === "Access Denied" ? "danger" : "warning"}
          className="justify-center px-4 py-1.5 text-sm"
        >
          {statusLabel === "Checked In" && <CheckCircle2 size={13} />}
          {statusLabel}
        </Badge>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-sm text-secondary">
          <Clock size={14} />
          {isExpired ? "This pass has expired" : `Valid ${visitor.windowStart}–${visitor.windowEnd} today`}
        </div>

        {!isExpired && visitor.status === "approved" && (
          <p className="mt-1 text-xs text-tertiary">Expires in {formatCountdown(remaining)}</p>
        )}

        {!isExpired && visitor.status === "approved" && !scanned && (
          <Button className="mt-5 w-full" onClick={() => setScanned(true)}>
            <ScanLine size={15} /> Simulate Security Scan
          </Button>
        )}

        {scanned && !isExpired && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 text-sm font-medium text-success">
            Access granted — enjoy your visit!
          </motion.p>
        )}

        <p className="mt-5 text-[11px] text-tertiary">Code: {visitor.passCode} · Prototype for design competition demo</p>
      </motion.div>
    </div>
  );
}
