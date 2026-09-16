import type { HTMLAttributes } from "react";
import { cx } from "@/lib/cx";

type Tone = "brand" | "success" | "warning" | "danger" | "neutral" | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  dot?: boolean;
}

const tones: Record<Tone, string> = {
  brand: "bg-brand-100 text-brand-700 dark:text-brand-900",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  neutral: "bg-surface-raised text-tertiary border border-border",
  info: "bg-accent/10 text-accent",
};

const dotTones: Record<Tone, string> = {
  brand: "bg-brand-500",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-tertiary",
  info: "bg-accent",
};

export function Badge({ className, tone = "neutral", dot, children, ...props }: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    >
      {dot && <span className={cx("h-1.5 w-1.5 rounded-full", dotTones[tone])} />}
      {children}
    </span>
  );
}
