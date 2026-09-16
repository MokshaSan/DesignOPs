import { cx } from "@/lib/cx";

const LOCKUP_DARK = "/brand/nestura-lockup-on-dark.png";
const LOCKUP_LIGHT = "/brand/nestura-lockup-light.png";

export function NesturaLockup({
  height = 40,
  onDark = false,
  className,
}: {
  height?: number;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <img
      src={onDark ? LOCKUP_DARK : LOCKUP_LIGHT}
      alt="Nestura Smart Living OS"
      className={cx("block w-auto max-w-[min(280px,72vw)] object-contain object-left", onDark && "mix-blend-screen", className)}
      style={{ height }}
    />
  );
}

export function NesturaMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <div className={cx("overflow-hidden", className)} style={{ width: size, height: size }}>
      <img src={LOCKUP_DARK} alt="" className="h-full w-auto max-w-none object-cover object-left mix-blend-screen" />
    </div>
  );
}

export function NesturaLogo({ height = 36, inverted = false, className }: { height?: number; inverted?: boolean; className?: string }) {
  return <NesturaLockup height={height} onDark={inverted} className={className} />;
}
