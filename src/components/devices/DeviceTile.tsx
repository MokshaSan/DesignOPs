import { motion } from "framer-motion";
import type { Device } from "@/types";
import { deviceIcon } from "@/lib/icons";
import { Toggle } from "@/components/ui/Toggle";
import { cx } from "@/lib/cx";
import { useStore } from "@/store/useStore";

const STEP: Record<string, number> = { ac: 1, light: 10, curtain: 20 };

export function DeviceTile({ device }: { device: Device }) {
  const { toggleDevicePower, setDeviceValue } = useStore();
  const Icon = deviceIcon(device.kind);
  const hasSlider = ["light", "ac", "curtain"].includes(device.kind) && device.power;
  const step = STEP[device.kind] ?? 10;
  const min = device.kind === "ac" ? 18 : 0;
  const max = device.kind === "ac" ? 30 : 100;

  return (
    <motion.div
      layout
      className={cx(
        "flex flex-col gap-3 rounded-xl2 border bg-surface p-4 shadow-soft transition-colors",
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
        {device.kind !== "door" && device.kind !== "sensor" && (
          <Toggle checked={device.power} onChange={() => toggleDevicePower(device.id)} size="sm" aria-label={`Toggle ${device.name}`} />
        )}
        {device.kind === "door" && (
          <button
            onClick={() => toggleDevicePower(device.id)}
            className={cx(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold",
              device.power ? "bg-success/10 text-success" : "bg-danger/10 text-danger",
            )}
          >
            {device.power ? "Locked" : "Unlocked"}
          </button>
        )}
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
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-raised accent-brand-600"
          />
          <span className="w-12 shrink-0 text-right text-xs font-semibold tabular-nums text-secondary">
            {device.value}
            {device.unit}
          </span>
        </div>
      )}

      {device.kind === "sensor" && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-tertiary">Battery {device.battery}%</span>
          <span className={cx("font-semibold", device.status === "warning" ? "text-warning" : "text-success")}>
            {device.status === "warning" ? "Needs attention" : "Healthy"}
          </span>
        </div>
      )}
    </motion.div>
  );
}
