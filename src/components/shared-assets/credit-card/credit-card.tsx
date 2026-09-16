import { cx } from "@/lib/cx";

export type CreditCardType = "brand-dark" | "brand-light" | "gray-dark" | "gray-light";

const skins: Record<CreditCardType, string> = {
  "brand-dark": "bg-gradient-to-br from-[#2a1659] via-[#160c2e] to-[#07040f] text-white",
  "brand-light": "bg-gradient-to-br from-violet-200 via-white to-indigo-100 text-neutral-900",
  "gray-dark": "bg-gradient-to-br from-neutral-800 via-neutral-900 to-black text-white",
  "gray-light": "bg-gradient-to-br from-neutral-100 via-white to-neutral-200 text-neutral-900",
};

export default function CreditCard({
  type = "brand-dark",
  company = "NESTURA",
  cardNumber,
  cardHolder,
  cardExpiration,
  note,
  className,
}: {
  type?: CreditCardType;
  company?: string;
  cardNumber: string;
  cardHolder: string;
  cardExpiration: string;
  note?: string;
  className?: string;
}) {
  const dark = type.includes("dark");
  return (
    <div
      className={cx(
        "relative w-full max-w-[380px] overflow-hidden rounded-[20px] p-5 text-left shadow-[0_24px_60px_-20px_rgba(76,29,149,0.85)]",
        skins[type],
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-violet-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 h-36 w-36 rounded-full bg-indigo-400/20 blur-3xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className={cx("text-[11px] font-semibold tracking-[0.28em]", dark ? "text-white/70" : "text-neutral-500")}>{company}</p>
          <p className="mt-1 text-lg font-semibold tracking-tight">Smart Access</p>
        </div>
        <div className="h-8 w-10 rounded-md bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 opacity-90 shadow-inner" />
      </div>

      <p className={cx("relative mt-7 font-mono text-[17px] tracking-[0.22em]", dark ? "text-white/95" : "text-neutral-800")}>{cardNumber}</p>

      <div className="relative mt-6 grid grid-cols-2 gap-3 text-[11px]">
        <div>
          <p className={cx("uppercase tracking-[0.16em]", dark ? "text-white/45" : "text-neutral-400")}>Card holder</p>
          <p className="mt-0.5 truncate text-sm font-semibold">{cardHolder}</p>
        </div>
        <div>
          <p className={cx("uppercase tracking-[0.16em]", dark ? "text-white/45" : "text-neutral-400")}>Valid thru</p>
          <p className="mt-0.5 text-sm font-semibold">{cardExpiration}</p>
        </div>
      </div>
      {note && <p className={cx("relative mt-4 truncate text-[11px]", dark ? "text-white/55" : "text-neutral-500")}>{note}</p>}
    </div>
  );
}
