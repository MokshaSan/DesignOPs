import { useState } from "react";
import { Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { Modal } from "@/components/ui/Modal";
import { Toggle } from "@/components/ui/Toggle";
import { deviceIcon } from "@/lib/icons";
import { useAIMaintenance } from "@/hooks/useAI";
import type { Device, DeviceKind } from "@/types";
import { cx } from "@/lib/cx";
import { HOME_UNITS } from "@/lib/units";

const STATUS_TONE = { online: "success", warning: "warning", offline: "danger" } as const;

export function OperatorDevices() {
  const devices = useStore((s) => s.devices);
  const { addDevice, deleteDevice, toggleDevicePower } = useStore();
  const [selected, setSelected] = useState<Device | null>(null);
  const [name, setName] = useState("");
  const [unitId, setUnitId] = useState<string>(HOME_UNITS[0]);
  const [kind, setKind] = useState<DeviceKind>("light");
  const [room, setRoom] = useState("Living Room");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Device Fleet</h1>
        <p className="mt-1 text-sm text-tertiary">{devices.length} devices across Tower A. Add to any unit, toggle power, or remove.</p>
      </div>

      <Card className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <label className="flex-1 text-xs font-medium text-tertiary">
          Name
          <input
            className="mt-1 h-10 w-full rounded-lg border border-border bg-surface-raised px-3 text-sm text-primary"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Corridor light"
          />
        </label>
        <label className="text-xs font-medium text-tertiary">
          Unit
          <select
            className="mt-1 h-10 rounded-lg border border-border bg-surface-raised px-3 text-sm text-primary"
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
          >
            {HOME_UNITS.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-tertiary">
          Room
          <input
            className="mt-1 h-10 rounded-lg border border-border bg-surface-raised px-3 text-sm text-primary"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
        </label>
        <label className="text-xs font-medium text-tertiary">
          Kind
          <select
            className="mt-1 h-10 rounded-lg border border-border bg-surface-raised px-3 text-sm text-primary"
            value={kind}
            onChange={(e) => setKind(e.target.value as DeviceKind)}
          >
            {["light", "ac", "curtain", "outlet", "door", "sensor", "camera"].map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </label>
        <Button
          onClick={() => {
            if (!name.trim()) return;
            addDevice({ name: name.trim(), unitId, room, kind, power: false });
            setName("");
          }}
        >
          <Plus size={15} /> Add to unit
        </Button>
      </Card>

      <Card padded={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-raised text-xs uppercase tracking-wide text-tertiary">
              <tr>
                <th className="px-4 py-3 font-medium">Device</th>
                <th className="px-4 py-3 font-medium">Unit</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Health</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Last Heartbeat</th>
                <th className="px-4 py-3 font-medium">Control</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((d) => {
                const Icon = deviceIcon(d.kind);
                return (
                  <tr
                    key={d.id}
                    onClick={() => setSelected(d)}
                    className="cursor-pointer border-b border-border last:border-0 hover:bg-surface-raised"
                  >
                    <td className="flex items-center gap-2.5 px-4 py-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:text-brand-900">
                        <Icon size={14} />
                      </div>
                      <span className="font-medium text-primary">{d.name}</span>
                    </td>
                    <td className="px-4 py-3 text-secondary">{d.unitId}</td>
                    <td className="px-4 py-3">
                      <Badge tone={STATUS_TONE[d.status]} dot className="capitalize">
                        {d.status}
                      </Badge>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={d.health ?? 100}
                          size="sm"
                          className="w-20"
                          tone={(d.health ?? 100) > 80 ? "success" : (d.health ?? 100) > 60 ? "warning" : "danger"}
                        />
                        <span className="text-xs text-tertiary">{d.health ?? 100}%</span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-tertiary md:table-cell">{d.lastHeartbeat}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        {d.kind === "door" ? (
                          <Button
                            size="sm"
                            variant={d.power ? "outline" : "primary"}
                            onClick={() => toggleDevicePower(d.id)}
                          >
                            {d.power ? "Unlock" : "Lock"}
                          </Button>
                        ) : d.kind !== "sensor" ? (
                          <Toggle checked={d.power} onChange={() => toggleDevicePower(d.id)} size="sm" aria-label={`Toggle ${d.name}`} />
                        ) : null}
                        <button
                          type="button"
                          aria-label={`Delete ${d.name}`}
                          onClick={() => {
                            if (window.confirm(`Remove ${d.name} from ${d.unitId}?`)) deleteDevice(d.id);
                          }}
                          className="rounded-lg p-1.5 text-tertiary hover:bg-danger/10 hover:text-danger"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <DeviceDetailModal device={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function DeviceDetailModal({ device, onClose }: { device: Device | null; onClose: () => void }) {
  const { run, loading } = useAIMaintenance();
  const [prediction, setPrediction] = useState<{ risk: string; reasoning: string; recommendation: string; source: string } | null>(null);

  async function analyze() {
    if (!device) return;
    const res = await run(device);
    if (res) setPrediction(res);
  }

  return (
    <Modal open={!!device} onClose={() => { onClose(); setPrediction(null); }} title={device?.name}>
      {device && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-surface-raised p-3">
              <p className="text-xs text-tertiary">Unit</p>
              <p className="font-semibold text-primary">{device.unitId}</p>
            </div>
            <div className="rounded-lg bg-surface-raised p-3">
              <p className="text-xs text-tertiary">Last Heartbeat</p>
              <p className="font-semibold text-primary">{device.lastHeartbeat}</p>
            </div>
            {device.battery !== undefined && (
              <div className="rounded-lg bg-surface-raised p-3">
                <p className="text-xs text-tertiary">Battery</p>
                <p className="font-semibold text-primary">{device.battery}%</p>
              </div>
            )}
            {device.errorCount !== undefined && (
              <div className="rounded-lg bg-surface-raised p-3">
                <p className="text-xs text-tertiary">Recent Errors</p>
                <p className="font-semibold text-primary">{device.errorCount}</p>
              </div>
            )}
            {device.latencyMs !== undefined && (
              <div className="rounded-lg bg-surface-raised p-3">
                <p className="text-xs text-tertiary">Response Latency</p>
                <p className="font-semibold text-primary">{device.latencyMs}ms</p>
              </div>
            )}
            <div className="rounded-lg bg-surface-raised p-3">
              <p className="text-xs text-tertiary">Health Score</p>
              <p className="font-semibold text-primary">{device.health ?? 100}%</p>
            </div>
          </div>

          {!prediction && (
            <button
              onClick={analyze}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-brand-300 bg-brand-50 p-4 text-sm font-medium text-brand-700 hover:bg-brand-100 disabled:opacity-60 dark:bg-brand-900/20 dark:text-brand-400"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Analyzing telemetry...
                </>
              ) : (
                <>
                  <Sparkles size={15} /> Run AI Health Prediction
                </>
              )}
            </button>
          )}

          {prediction && (
            <div className="space-y-2 rounded-xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-800/60 dark:bg-brand-900/20">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-400">
                  {prediction.source === "ai" ? "Nestura · live model" : "Nestura · fallback (no key / API error)"}
                </p>
                <Badge
                  tone={prediction.risk === "critical" || prediction.risk === "high" ? "danger" : prediction.risk === "medium" ? "warning" : "success"}
                  className="capitalize"
                >
                  {prediction.risk} risk
                </Badge>
              </div>
              <p className="text-sm text-secondary">{prediction.reasoning}</p>
              <p className={cx("text-sm font-medium text-primary")}>{prediction.recommendation}</p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
