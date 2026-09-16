import type { VisitorRequest } from "@/types";

const PURPOSE: Record<VisitorRequest["type"], string> = {
  guest: "Personal visit",
  delivery: "Delivery",
  contractor: "Contractor work",
  service: "Service call",
};

function groupedCode(code: string) {
  const digits = code.replace(/[^A-Z0-9]/gi, "").toUpperCase().padEnd(16, "0").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

export function AccessPassCard({ visitor }: { visitor: VisitorRequest }) {
  const host = visitor.hostName ?? "Resident";
  const going = visitor.destination ?? `Tower A · Unit ${visitor.unitId}`;
  const why = visitor.purpose ?? PURPOSE[visitor.type];

  return (
    <div className="relative w-full max-w-[380px] overflow-hidden rounded-[20px] bg-gradient-to-br from-[#2a1659] via-[#160c2e] to-[#07040f] p-6 text-left text-white shadow-[0_24px_60px_-20px_rgba(76,29,149,0.85)] aspect-[1.62/1]">
      <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-violet-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 h-36 w-36 rounded-full bg-indigo-400/20 blur-3xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.28em] text-white/70">NESTURA</p>
          <p className="mt-1 text-lg font-semibold tracking-tight">Smart Access</p>
        </div>
        <div className="h-8 w-10 rounded-md bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 opacity-90 shadow-inner" />
      </div>

      <p className="relative mt-7 font-mono text-[17px] tracking-[0.22em] text-white/95">{groupedCode(visitor.passCode)}</p>

      <div className="relative mt-6 grid grid-cols-2 gap-3 text-[11px]">
        <div>
          <p className="uppercase tracking-[0.16em] text-white/45">Visitor</p>
          <p className="mt-0.5 truncate text-sm font-semibold">{visitor.name}</p>
        </div>
        <div>
          <p className="uppercase tracking-[0.16em] text-white/45">Host</p>
          <p className="mt-0.5 truncate text-sm font-semibold">{host}</p>
        </div>
        <div>
          <p className="uppercase tracking-[0.16em] text-white/45">Going to</p>
          <p className="mt-0.5 truncate text-sm font-semibold">{going}</p>
        </div>
        <div>
          <p className="uppercase tracking-[0.16em] text-white/45">Valid</p>
          <p className="mt-0.5 text-sm font-semibold">
            {visitor.windowStart}–{visitor.windowEnd}
          </p>
        </div>
      </div>

      <p className="relative mt-4 truncate text-[11px] text-white/55">
        {why} · {visitor.requestedFor}
      </p>
    </div>
  );
}
