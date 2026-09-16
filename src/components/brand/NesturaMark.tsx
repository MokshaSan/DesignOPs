import { cx } from "@/lib/cx";

interface NesturaMarkProps {
  size?: number;
  rounded?: string;
  className?: string;
}

/**
 * The Nestura brand mark — a house-and-signal glyph on a fixed blue->teal
 * gradient badge. Recreated as SVG (rather than the source PNG) so it stays
 * crisp at favicon/sidebar sizes and adapts to any background.
 */
export function NesturaMark({ size = 36, rounded = "rounded-xl", className }: NesturaMarkProps) {
  return (
    <div
      className={cx("brand-mark flex shrink-0 items-center justify-center text-white", rounded, className)}
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 12.5 12 5l8 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 11v8h5v-5h2v5h5v-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.5 8.2a4.2 4.2 0 0 1 3 1.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M15.5 6.4a6.6 6.6 0 0 1 4.7 1.95" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
      </svg>
    </div>
  );
}

export function NesturaWordmark({ className, sub }: { className?: string; sub?: boolean }) {
  return (
    <div className={cx("leading-tight", className)}>
      <p className="text-sm font-bold tracking-tight text-primary">Nestura</p>
      {sub && <p className="text-[11px] font-medium text-tertiary">Smart Living OS</p>}
    </div>
  );
}
