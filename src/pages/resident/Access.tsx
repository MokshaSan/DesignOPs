import { useState } from "react";
import { Fingerprint, Lock, Unlock, Car, DoorClosed, QrCode } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { AccessPassCard } from "@/components/visitors/AccessPassCard";
import { PassQRCode } from "@/components/visitors/PassQRCode";
import { useStore, useResidentDevices } from "@/store/useStore";
import type { VisitorRequest, VisitorType } from "@/types";
import { CURRENT_UNIT } from "@/data/seed";
import { TIER_PERMISSIONS } from "@/data/permissions";
import { RestrictedNotice } from "@/components/ui/RestrictedNotice";

function uid() {
  return `pass-${Math.random().toString(36).slice(2, 8)}`;
}
function passCode() {
  return `JK-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function ResidentAccess() {
  const { toggleDevicePower, addVisitorRequest, addNotification, residentTier } = useStore();
  const devices = useResidentDevices();
  const canGrantAccess = TIER_PERMISSIONS[residentTier].access;
  const door = devices.find((d) => d.kind === "door");
  const [formOpen, setFormOpen] = useState(false);
  const [passOpen, setPassOpen] = useState(false);
  const [createdPass, setCreatedPass] = useState<VisitorRequest | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState<VisitorType>("guest");
  const [start, setStart] = useState("18:00");
  const [end, setEnd] = useState("19:00");

  function generatePass() {
    if (!name.trim()) return;
    const pass: VisitorRequest = {
      id: uid(),
      name,
      type,
      unitId: CURRENT_UNIT.id,
      hostName: CURRENT_UNIT.residentName,
      destination: `${CURRENT_UNIT.tower} · Unit ${CURRENT_UNIT.id}`,
      purpose: type,
      requestedFor: new Date().toISOString().slice(0, 10),
      windowStart: start,
      windowEnd: end,
      riskLevel: "low",
      riskReason: "Issued directly by resident",
      status: "approved",
      passCode: passCode(),
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    addVisitorRequest(pass);
    addNotification({ icon: "ShieldCheck", title: "Access pass created", body: `${name} can enter ${start}–${end} today.`, category: "visitor" });
    setCreatedPass(pass);
    setFormOpen(false);
    setPassOpen(true);
    setName("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Access</h1>
        <p className="mt-1 text-sm text-tertiary">Manage locks and issue temporary access passes.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex flex-col items-center gap-3 text-center">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${door?.power ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
            {door?.power ? <Lock size={20} /> : <Unlock size={20} />}
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">Front Door</p>
            <p className="text-xs text-tertiary">{door?.power ? "Locked" : "Unlocked"}</p>
          </div>
          <Button size="sm" variant={door?.power ? "outline" : "primary"} onClick={() => door && toggleDevicePower(door.id)}>
            {door?.power ? "Unlock" : "Lock"}
          </Button>
        </Card>

        <Card className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
            <Car size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">Garage</p>
            <p className="text-xs text-tertiary">Available</p>
          </div>
          <Badge tone="success">Auto-controlled</Badge>
        </Card>

        <Card className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
            <DoorClosed size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">Building Main Entrance</p>
            <p className="text-xs text-tertiary">Locked · Key fob required</p>
          </div>
          <Badge tone="neutral">Building-managed</Badge>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grant Temporary Access</CardTitle>
          <Fingerprint size={16} className="text-tertiary" />
        </CardHeader>
        {canGrantAccess ? (
          <>
            <p className="text-sm text-tertiary">Issue a time-boxed QR pass for a guest, delivery, or contractor.</p>
            <Button className="mt-4" onClick={() => setFormOpen(true)}>
              <QrCode size={15} /> Grant Access
            </Button>
          </>
        ) : (
          <RestrictedNotice message="Your tenant tier doesn't include visitor access management. Ask the unit owner to grant this permission or issue passes on your behalf." />
        )}
      </Card>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Grant Access">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-secondary">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Fernando"
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-primary placeholder:text-tertiary focus:border-brand-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-secondary">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as VisitorType)}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-primary focus:border-brand-400 focus:outline-none"
            >
              <option value="guest">Guest</option>
              <option value="delivery">Delivery</option>
              <option value="contractor">Contractor</option>
              <option value="service">Service</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-secondary">From</label>
              <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-primary focus:border-brand-400 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-secondary">To</label>
              <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-primary focus:border-brand-400 focus:outline-none" />
            </div>
          </div>
          <Button className="w-full" onClick={generatePass} disabled={!name.trim()}>
            Generate Pass
          </Button>
        </div>
      </Modal>

      <Modal open={passOpen} onClose={() => setPassOpen(false)} title="Access Granted">
        {createdPass && (
          <div className="flex flex-col items-center gap-4">
            <AccessPassCard visitor={createdPass} />
            <PassQRCode value={`${window.location.origin}/visitor/pass/${createdPass.id}`} />
            <Badge tone="success">
              Valid {createdPass.windowStart}–{createdPass.windowEnd} today
            </Badge>
            <p className="text-xs text-tertiary">Code: {createdPass.passCode} · Automatically expires after the access window.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
