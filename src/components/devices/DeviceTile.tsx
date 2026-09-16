import { motion } from "framer-motion";
import { Trash2, Lock, Unlock } from "lucide-react";
import type { Device } from "@/types";
import { deviceIcon } from "@/lib/icons";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/cx";
import { useStore, useCanManageAccess } from "@/store/useStore";

const STEP: Record<string, number> = { ac: 1, light: 10, curtain: 20 };

export function DeviceTile({ device }: { device: Device }) {
  const { toggleDevicePower, setDeviceValue, deleteDevice } = useStore();
  const canLocks = useCanManageAccess();
  const Icon = deviceIcon(device.kind);
  const hasSlider = ["light", "ac", "curtain"].includes(device.kind) && device.power;
  const step = STEP[device.kind] ?? 10;
  const min = device.kind === "ac" ? 18 : 0;
  const max = device.kind === "ac" ? 30 : 100;

  return (
    <motion.div
      layout
      className={cx(
        "flex flex-col gap-3 rounded-xl2 border bg-surface p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        device.power ? "border-brand-200 dark:border-brand-800/60" : "border-border",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={cx(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
              device.power ? "bg-brand-600 text-white dark:bg-brand-300" : "bg-surface-raised text-tertiary",
            )}
          >
            <Icon size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">{device.name}</p>
            <p className="text-xs text-tertiary">{device.room}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {device.kind !== "door" && device.kind !== "sensor" && (
            <Toggle checked={device.power} onChange={() => toggleDevicePower(device.id)} size="sm" aria-label={`Toggle ${device.name}`} />
          )}
          {device.kind === "door" && (
            <Button
              type="button"
              size="sm"
              variant={device.power ? "outline" : "primary"}
              disabled={!canLocks}
              onClick={() => toggleDevicePower(device.id)}
            >
              {device.power ? <Unlock size={13} /> : <Lock size={13} />}
              {device.power ? "Unlock" : "Lock"}
            </Button>
          )}
          <button
            type="button"
            aria-label={`Delete ${device.name}`}
            onClick={() => {
              if (window.confirm(`Remove ${device.name}? Scenes that used it will drop that step.`)) deleteDevice(device.id);
            }}
            className="rounded-lg p-1.5 text-tertiary hover:bg-danger/10 hover:text-danger"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {hasSlider && device.value !== undefined && (
        <div className="flex items-center gap-2.5">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={device.value}
            onChange={(e) => setDeviceValue(device.id, Number(e.target.value))}
            className="control-slider w-full"
          />
          <span className="w-12 shrink-0 text-right text-xs font-semibold tabular-nums text-secondary">
            {device.value}
            {device.unit}
          </span>
        </div>
      )}

      {device.kind === "sensor" && (
        <>
          <div className="flex items-center justify-between text-xs">
            <span className="text-tertiary">Battery {device.battery}%</span>
            <span className={cx("font-semibold", device.status === "warning" ? "text-warning" : "text-success")}>
              {device.status === "warning" ? "Needs attention" : "Healthy"}
            </span>
          </div>
          <p className="text-[11px] text-tertiary">Simulated device — reading jitters every 9s. Not a physical sensor.</p>
        </>
      )}
    </motion.div>
  );
}
