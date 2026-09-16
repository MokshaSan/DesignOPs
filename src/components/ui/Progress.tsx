import { cx } from "@/lib/cx";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  tone?: "brand" | "success" | "warning" | "danger";
  size?: "sm" | "md";
}

const toneMap = {
  brand: "bg-brand-500",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export function Progress({ value, max = 100, className, tone = "brand", size = "md" }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cx("w-full overflow-hidden rounded-full bg-surface-raised border border-border", size === "sm" ? "h-1.5" : "h-2.5", className)}>
      <div
        className={cx("h-full rounded-full transition-all duration-700 ease-out", toneMap[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
