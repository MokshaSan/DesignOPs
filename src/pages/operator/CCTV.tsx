import { useState } from "react";
import { Video, ShieldAlert, Maximize2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { cx } from "@/lib/cx";

interface Camera {
  id: string;
  name: string;
  zone: string;
  status: "live" | "offline";
}

const CAMERAS: Camera[] = [
  { id: "cam-lobby", name: "Main Lobby", zone: "Ground Floor", status: "live" },
  { id: "cam-mailroom", name: "Mailroom & Parcel Room", zone: "Ground Floor", status: "live" },
  { id: "cam-b1", name: "Resident Parking B1", zone: "Basement 1", status: "live" },
  { id: "cam-b2", name: "Visitor Parking B2", zone: "Basement 2", status: "live" },
  { id: "cam-corridor8", name: "Corridor — Floor 8", zone: "Tower A", status: "live" },
  { id: "cam-corridor14", name: "Corridor — Floor 14", zone: "Tower A", status: "offline" },
  { id: "cam-pool", name: "Rooftop Pool Deck", zone: "Level 21", status: "live" },
  { id: "cam-service", name: "Service Entrance", zone: "Ground Floor", status: "live" },
];

function CameraTile({ cam, onOpen }: { cam: Camera; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="group relative aspect-video overflow-hidden rounded-xl2 border border-border bg-neutral-950 text-left"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.18),transparent_55%)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(0deg,#fff_0px,#fff_1px,transparent_1px,transparent_3px)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Video size={28} className={cx(cam.status === "live" ? "text-white/25" : "text-white/10")} />
      </div>

      {cam.status === "live" ? (
        <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-danger" />
          </span>
          Simulated
        </span>
      ) : (
        <span className="absolute left-2.5 top-2.5 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/50">
          Offline
        </span>
      )}

      <Maximize2 size={13} className="absolute right-2.5 top-2.5 text-white/40 opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2.5">
        <p className="text-xs font-semibold text-white">{cam.name}</p>
        <p className="text-[11px] text-white/60">{cam.zone}</p>
      </div>
    </button>
  );
}

export function OperatorCCTV() {
  const [selected, setSelected] = useState<Camera | null>(null);
  const liveCount = CAMERAS.filter((c) => c.status === "live").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">CCTV</h1>
          <p className="mt-1 text-sm text-tertiary">
            Simulated cameras — {liveCount} of {CAMERAS.length} placeholder tiles. No real video is captured or stored.
          </p>
        </div>
        <Badge tone="neutral" className="gap-2">
          <ShieldAlert size={12} /> Building Operations access only — simulated feeds
        </Badge>
      </div>

      <Card className="flex items-start gap-3 border-warning/30 bg-warning/5">
        <ShieldAlert size={16} className="mt-0.5 shrink-0 text-warning" />
        <p className="text-xs leading-relaxed text-secondary">
          Camera access is restricted to authorized Building Operations users and is never exposed to residents,
          tenants or visitors. Feeds shown here are simulated placeholders for this prototype — no real video is
          captured or stored.
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CAMERAS.map((cam) => (
          <CameraTile key={cam.id} cam={cam} onOpen={() => setSelected(cam)} />
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name} maxWidth="max-w-2xl">
        {selected && (
          <div className="space-y-3">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-neutral-950">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.2),transparent_55%)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Video size={40} className="text-white/20" />
              </div>
              {selected.status === "live" && (
                <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-danger" /> Simulated
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-tertiary">{selected.zone}</span>
              <Badge tone={selected.status === "live" ? "success" : "neutral"} className="capitalize">
                {selected.status}
              </Badge>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
