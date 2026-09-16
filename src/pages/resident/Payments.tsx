import { CreditCard, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RestrictedNotice } from "@/components/ui/RestrictedNotice";
import { StatTile } from "@/components/ui/StatTile";
import { useStore } from "@/store/useStore";
import { TIER_PERMISSIONS } from "@/data/permissions";
import type { Invoice } from "@/types";

function money(inv: Invoice) {
  return `${inv.currency} ${inv.amount.toLocaleString()}`;
}

export function ResidentPayments() {
  const { invoices, payInvoice, residentTier, logActivity, accountUnitId } = useStore();
  const allowed = TIER_PERMISSIONS[residentTier].billing;
  const mine = invoices.filter((i) => !i.unitId || i.unitId === accountUnitId);
  const due = mine.filter((i) => i.status !== "paid");
  const paid = mine.filter((i) => i.status === "paid");
  const dueTotal = due.reduce((s, i) => s + i.amount, 0);

  if (!allowed) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-primary">Payments</h1>
        <RestrictedNotice message="Billing is visible to the unit owner only on this demo account." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Rent & payments</h1>
        <p className="mt-1 text-sm text-tertiary">{accountUnitId} · The Meridian Tower A</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatTile label="Balance due" value={`LKR ${dueTotal.toLocaleString()}`} icon={CreditCard} tone={dueTotal ? "warning" : "success"} />
        <StatTile label="Open invoices" value={String(due.length)} icon={CreditCard} tone="brand" />
        <StatTile label="Paid this year" value={String(paid.length)} icon={CheckCircle2} tone="success" />
      </div>

      <div className="space-y-3">
        {invoices.map((inv) => (
          <Card key={inv.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">{inv.period}</p>
              <p className="text-xs text-tertiary">Due {inv.dueDate}{inv.method ? ` · ${inv.method}` : ""}</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold text-primary">{money(inv)}</p>
              <Badge tone={inv.status === "paid" ? "success" : inv.status === "overdue" ? "danger" : "warning"} className="capitalize">
                {inv.status}
              </Badge>
              {inv.status !== "paid" && (
                <Button
                  size="sm"
                  onClick={() => {
                    payInvoice(inv.id);
                    logActivity(`Paid ${inv.period}`);
                  }}
                >
                  Pay now
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
