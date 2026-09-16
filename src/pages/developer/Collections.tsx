import { CreditCard, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatTile } from "@/components/ui/StatTile";
import { useStore } from "@/store/useStore";
import { PROPERTIES } from "@/data/seed";

export function DeveloperCollections() {
  const { invoices } = useStore();
  const paid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const due = invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Collections</h1>
        <p className="mt-1 text-sm text-tertiary">Rent and service-charge flow across the Nestura portfolio.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatTile label="Collected (sample unit)" value={`LKR ${paid.toLocaleString()}`} icon={TrendingUp} tone="success" />
        <StatTile label="Outstanding" value={`LKR ${due.toLocaleString()}`} icon={CreditCard} tone="warning" />
        <StatTile label="Properties" value={String(PROPERTIES.length)} icon={CreditCard} tone="brand" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meridian Tower A · Unit 12A</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {invoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between rounded-xl bg-surface-raised px-4 py-3">
              <div>
                <p className="text-sm font-medium text-primary">{inv.period}</p>
                <p className="text-[11px] text-tertiary">Due {inv.dueDate}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-primary">
                  {inv.currency} {inv.amount.toLocaleString()}
                </p>
                <Badge tone={inv.status === "paid" ? "success" : "warning"} className="capitalize">
                  {inv.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
