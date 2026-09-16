import type { HTMLAttributes } from "react";
import { cx } from "@/lib/cx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  padded?: boolean;
}

export function Card({ className, glow, padded = true, children, ...props }: CardProps) {
  return (
    <div
      className={cx(
        "rounded-xl2 border border-border bg-surface shadow-soft",
        glow && "card-glow",
        padded && "p-5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx("mb-4 flex items-center justify-between gap-3", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cx("text-sm font-semibold tracking-wide text-primary", className)} {...props}>
      {children}
    </h3>
  );
}
