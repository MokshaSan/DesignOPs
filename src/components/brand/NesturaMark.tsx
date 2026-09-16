import { cx } from "@/lib/cx";

const LOGO = "/brand/nestura-logo-clear.png";

export function NesturaLockup({
  height = 40,
  onDark = false,
  className,
}: {
  height?: number;
  onDark?: boolean;
  className?: string;
}) {
  if (onDark) {
    return (
      <div className={cx("flex items-center gap-2.5", className)}>
        <div className="shrink-0 overflow-hidden" style={{ height, width: height }}>
          <img src={LOGO} alt="" className="h-full w-auto max-w-none object-cover object-left" />
        </div>
        <div className="leading-tight">
          <p className="font-semibold tracking-tight text-white" style={{ fontSize: Math.max(15, height * 0.4) }}>
            Nestura
          </p>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/70">Smart Living OS</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={LOGO}
      alt="Nestura Smart Living OS"
      className={cx("w-auto object-contain object-left", className)}
      style={{ height }}
    />
  );
}

export function NesturaMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <div className={cx("flex shrink-0 items-center justify-center overflow-hidden", className)} style={{ width: size, height: size }}>
      <img src={LOGO} alt="" className="h-full w-auto max-w-none object-cover object-left" />
    </div>
  );
}

export function NesturaLogo({
  height = 36,
  inverted = false,
  className,
}: {
  height?: number;
  inverted?: boolean;
  className?: string;
}) {
  return <NesturaLockup height={height} onDark={inverted} className={className} />;
}

export function NesturaWordmark({ className, sub }: { className?: string; sub?: boolean }) {
  return (
    <div className={cx("leading-tight", className)}>
      <p className="text-sm font-bold tracking-tight text-primary">Nestura</p>
      {sub && <p className="text-[11px] font-medium text-tertiary">Smart Living OS</p>}
    </div>
  );
}
