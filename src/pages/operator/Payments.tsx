import { useState } from "react";
import { CreditCard, TrendingUp, AlertTriangle, CheckCircle2, Building2, MessageCircle, BellRing, Printer } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatTile } from "@/components/ui/StatTile";
import { cx } from "@/lib/cx";
import { useStore } from "@/store/useStore";
import { ReceiptModal } from "@/components/payments/ReceiptModal";
import { buildReminderMessage, receiptNumber, whatsappDigits, whatsAppLink } from "@/lib/receipt";
import type { Invoice } from "@/types";

type Filter = "all" | "paid" | "outstanding";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "paid", label: "Paid" },
  { key: "outstanding", label: "Outstanding" },
];

export function OperatorPayments() {
  const { invoices, addNotification, logActivity } = useStore();
  const [activeReceipt, setActiveReceipt] = useState<{ invoice: Invoice; autoPrint?: boolean } | null>(null);
  const [filter, setFilter] = useState<Filter>("outstanding");

  const paid = invoices.filter((i) => i.status === "paid");
  const due = invoices.filter((i) => i.status === "due");
  const overdue = invoices.filter((i) => i.status === "overdue");
  const outstanding = [...due, ...overdue];
  const collected = paid.reduce((s, i) => s + i.amount, 0);
  const outstandingTotal = outstanding.reduce((s, i) => s + i.amount, 0);
  const collectionRate = invoices.length > 0 ? Math.round((paid.length / invoices.length) * 100) : 0;
  const unitsWithBalance = new Set(outstanding.map((i) => i.unitId)).size;

  const rows = filter === "all" ? invoices : filter === "paid" ? paid : outstanding;

  function printReceiptFor(inv: Invoice) {
    setActiveReceipt({ invoice: inv, autoPrint: true });
    logActivity(`Printing ${inv.period} receipt (${receiptNumber(inv)}) for unit ${inv.unitId}`);
  }

  function sendReminder(inv: Invoice) {
    const phone = whatsappDigits(inv.phone);
    if (phone) {
      window.open(whatsAppLink(phone, buildReminderMessage(inv)), "_blank", "noopener,noreferrer");
    }
    addNotification({
      icon: "CreditCard",
      title: inv.status === "overdue" ? "Payment overdue reminder" : "Payment reminder",
      body: `Reminder sent for ${inv.period} (${inv.currency} ${inv.amount.toLocaleString()}) for Unit ${inv.unitId}.`,
      category: "billing",
    });
    logActivity(`Sent ${inv.status} payment reminder to unit ${inv.unitId} for ${inv.period}`);
  }

  function printAll() {
    window.print();
    logActivity(`Printing invoice log for ${invoices.length} invoices`);
  }

  return (
    <div className="space-y-6">
      <ReceiptModal
        invoice={activeReceipt?.invoice ?? null}
        autoPrint={activeReceipt?.autoPrint}
        onClose={() => setActiveReceipt(null)}
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Rent & Payments</h1>
          <p className="mt-1 text-sm text-tertiary">Building-wide billing overview · The Meridian Tower A</p>
        </div>
        <Button size="sm" variant="outline" onClick={printAll}>
          <Printer size={14} /> Print invoice log
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Collected" value={`LKR ${(collected / 1000).toFixed(0)}k`} icon={TrendingUp} tone="success" />
        <StatTile label="Outstanding" value={`LKR ${(outstandingTotal / 1000).toFixed(0)}k`} icon={CreditCard} tone={outstandingTotal > 0 ? "warning" : "success"} />
        <StatTile label="Overdue" value={String(overdue.length)} icon={AlertTriangle} tone={overdue.length > 0 ? "danger" : "success"} />
        <StatTile label="Collection rate" value={`${collectionRate}%`} icon={CheckCircle2} tone={collectionRate >= 80 ? "success" : "warning"} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-surface-raised p-3">
              <span className="flex items-center gap-2 text-sm text-secondary">
                <CheckCircle2 size={15} className="text-success" /> Paid
              </span>
              <span className="text-sm font-semibold text-primary">{paid.length} invoices</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-surface-raised p-3">
              <span className="flex items-center gap-2 text-sm text-secondary">
                <CreditCard size={15} className="text-warning" /> Due
              </span>
              <span className="text-sm font-semibold text-primary">{due.length} invoices</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-surface-raised p-3">
              <span className="flex items-center gap-2 text-sm text-secondary">
                <AlertTriangle size={15} className="text-danger" /> Overdue
              </span>
              <span className="text-sm font-semibold text-primary">{overdue.length} invoices</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-surface-raised p-3">
              <span className="flex items-center gap-2 text-sm text-secondary">
                <Building2 size={15} className="text-brand-600" /> Units with balance
              </span>
              <span className="text-sm font-semibold text-primary">{unitsWithBalance}</span>
            </div>
          </div>
        </Card>

        <Card padded={false} className="overflow-hidden lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-3 pt-5">
            <CardHeader className="mb-0">
              <CardTitle>Invoice Log</CardTitle>
            </CardHeader>
            <div className="flex items-center gap-1 rounded-lg bg-surface-raised p-1">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={cx(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    filter === f.key ? "bg-brand-600 text-white dark:bg-brand-300 dark:text-brand-900" : "text-secondary hover:text-primary",
                  )}
                >
                  {f.label}
                  <span className={cx("ml-1.5", filter === f.key ? "text-white/70 dark:text-brand-900/70" : "text-tertiary")}>
                    ({f.key === "all" ? invoices.length : f.key === "paid" ? paid.length : outstanding.length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-y border-border bg-surface-raised text-xs uppercase tracking-wide text-tertiary">
                <tr>
                  <th className="px-4 py-3 font-medium">Unit</th>
                  <th className="px-4 py-3 font-medium">Resident</th>
                  <th className="px-4 py-3 font-medium">Period</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Due date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-tertiary">
                      No {filter === "outstanding" ? "outstanding" : filter === "paid" ? "paid" : ""} invoices.
                    </td>
                  </tr>
                )}
                {rows.map((inv) => (
                  <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-surface-raised">
                    <td className="px-4 py-3 font-medium text-primary">Unit {inv.unitId ?? "—"}</td>
                    <td className="px-4 py-3 text-secondary">{inv.residentName ?? "Unknown"}</td>
                    <td className="px-4 py-3 text-secondary">{inv.period}</td>
                    <td className="px-4 py-3 font-semibold text-primary">
                      {inv.currency} {inv.amount.toLocaleString()}
                    </td>
                    <td className="hidden px-4 py-3 text-secondary sm:table-cell">{inv.dueDate}</td>
                    <td className="px-4 py-3">
                      <Badge tone={inv.status === "paid" ? "success" : inv.status === "overdue" ? "danger" : "warning"} className="capitalize">
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {inv.status === "paid" ? (
                          <Button size="sm" onClick={() => printReceiptFor(inv)}>
                            <Printer size={13} /> Print receipt
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => sendReminder(inv)}>
                            <MessageCircle size={13} /> Remind
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}