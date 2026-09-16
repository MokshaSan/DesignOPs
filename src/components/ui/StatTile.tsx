import type { LucideIcon } from "lucide-react";
import { cx } from "@/lib/cx";

interface StatTileProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  trend?: { value: string; positive?: boolean };
  tone?: "brand" | "success" | "warning" | "danger" | "neutral";
  className?: string;
}

const iconTones = {
  brand: "bg-brand-100 text-brand-700 dark:text-brand-900",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  neutral: "bg-surface-raised text-tertiary",
};

export function StatTile({ label, value, icon: Icon, trend, tone = "brand", className }: StatTileProps) {
  return (
    <div className={cx("rounded-xl2 border border-border bg-surface p-4 shadow-soft", className)}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-tertiary">{label}</p>
        {Icon && (
          <div className={cx("flex h-8 w-8 items-center justify-center rounded-lg", iconTones[tone])}>
            <Icon size={16} strokeWidth={2.25} />
          </div>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold text-primary">{value}</p>
      {trend && (
        <p className={cx("mt-1 text-xs font-medium", trend.positive ? "text-success" : "text-tertiary")}>
          {trend.value}
        </p>
      )}
    </div>
  );
}
