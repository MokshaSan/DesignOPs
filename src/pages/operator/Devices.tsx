import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Modal } from "@/components/ui/Modal";
import { deviceIcon } from "@/lib/icons";
import { useAIMaintenance } from "@/hooks/useAI";
import type { Device } from "@/types";
import { cx } from "@/lib/cx";

const STATUS_TONE = { online: "success", warning: "warning", offline: "danger" } as const;

export function OperatorDevices() {
  const devices = useStore((s) => s.devices);
  const [selected, setSelected] = useState<Device | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Device Fleet</h1>
        <p className="mt-1 text-sm text-tertiary">{devices.length} devices across Tower A. Click a device for AI health analysis.</p>
      </div>

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
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-400">AI Prediction</p>
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
