import CreditCard from "@/components/shared-assets/credit-card/credit-card";
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
  const host = visitor.hostName || `Unit ${visitor.unitId}`;
  const going = visitor.destination ?? `Tower A · Unit ${visitor.unitId}`;
  const why = visitor.purpose ?? PURPOSE[visitor.type];

  return (
    <CreditCard
      type="brand-dark"
      company="NESTURA"
      cardNumber={groupedCode(visitor.passCode)}
      cardHolder={visitor.name.toUpperCase()}
      cardExpiration={`${visitor.windowStart}–${visitor.windowEnd}`}
      note={`${host} · ${going} · ${why} · ${visitor.requestedFor}`}
    />
  );
}
