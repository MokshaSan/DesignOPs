import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, DoorOpen, Lock, XCircle } from "lucide-react";
import { useStore } from "@/store/useStore";
import { AccessPassCard } from "@/components/visitors/AccessPassCard";
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
  const navigate = useNavigate();
  const { visitors, expireVisitor, setVisitorDoor } = useStore();
  const visitor = useMemo(
    () => visitors.find((v) => v.id === id || v.passCode === id),
    [visitors, id],
  );
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const windowEnd = visitor ? parseTimeToday(visitor.windowEnd).getTime() : 0;
  const remaining = windowEnd - now;
  const windowOpen = visitor ? now >= parseTimeToday(visitor.windowStart).getTime() && remaining > 0 : false;
  const live = visitor?.status === "approved" && visitor.accessEnabled !== false && windowOpen;
  const isExpired = visitor?.status === "expired" || visitor?.status === "revoked" || (visitor && remaining <= 0 && visitor.status === "approved");

  useEffect(() => {
    if (visitor && remaining <= 0 && visitor.status === "approved") expireVisitor(visitor.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, visitor?.id]);

  if (!visitor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg p-6 text-center">
        <div>
          <BackButton to="/visitor/request" className="mb-6" />
          <p className="text-lg font-semibold text-primary">Pass not found</p>
          <p className="mt-1 text-sm text-tertiary">Enter your visitor ID on the request page.</p>
          <Button className="mt-4" onClick={() => navigate("/visitor/request")}>
            I already have an ID
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 p-6 text-white">
      <div className="mb-4 w-full max-w-sm">
        <BackButton to="/visitor/request" light />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 text-center shadow-2xl"
      >
        <NesturaLockup height={44} onDark className="mx-auto" />
        <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-white/50">Digital access card</p>
        <p className="mt-1 font-mono text-sm tracking-[0.2em] text-violet-200">{visitor.passCode}</p>

        <div className="mt-5">
          <AccessPassCard visitor={visitor} />
        </div>

        <div className="mt-5 flex justify-center">
          {visitor.status === "rejected" || isExpired || visitor.status === "revoked" ? (
            <Badge tone="danger">{visitor.status === "revoked" ? "Deactivated by resident" : "Access denied"}</Badge>
          ) : visitor.status === "pending" ? (
            <Badge tone="warning">Waiting for resident approval</Badge>
          ) : live ? (
            <Badge tone="success">
              <CheckCircle2 size={13} /> Active until {visitor.windowEnd}
            </Badge>
          ) : (
            <Badge tone="neutral">Approved · outside window</Badge>
          )}
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-sm text-white/70">
          <Clock size={14} />
          {visitor.windowStart}–{visitor.windowEnd} · {visitor.requestedFor}
        </div>
        {live && <p className="mt-1 text-xs text-white/50">Time left {formatCountdown(remaining)}</p>}

        {live && (
          <Button
            className="mt-5 w-full rounded-full py-3"
            variant={visitor.doorUnlocked ? "outline" : "primary"}
            onClick={() => setVisitorDoor(visitor.id, !visitor.doorUnlocked)}
          >
            {visitor.doorUnlocked ? <Lock size={15} /> : <DoorOpen size={15} />}
            {visitor.doorUnlocked ? "Lock the door" : "Unlock the door"}
          </Button>
        )}

        {visitor.doorUnlocked && live && (
          <p className="mt-3 text-sm font-medium text-emerald-300">Door is unlocked for this visit.</p>
        )}

        {(visitor.status === "revoked" || visitor.accessEnabled === false) && visitor.status !== "pending" && (
          <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-rose-300">
            <XCircle size={14} /> Resident turned this pass off
          </p>
        )}
      </motion.div>
    </div>
  );
}
