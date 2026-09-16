import type { Invoice } from "@/types";
import { formatMoney, receiptNumber } from "@/lib/receipt";

interface ReceiptProps {
  invoice: Invoice;
}

export function Receipt({ invoice }: ReceiptProps) {
  return (
    <div className="receipt-print rounded-xl2 border border-border bg-white p-6 text-ink">
      <div className="border-b border-dashed border-ink/20 pb-4">
        <p className="text-lg font-bold tracking-tight text-brand-700">Nestura</p>
        <p className="text-xs text-ink/60">The Meridian, Tower A · John Keells Properties</p>
      </div>

      <div className="py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">Payment receipt</p>
        <div className="mt-1 flex items-baseline justify-between">
          <p className="text-2xl font-bold">{formatMoney(invoice)}</p>
          <p className="text-[11px] text-ink/60">Receipt {receiptNumber(invoice)}</p>
        </div>
      </div>

      <div className="space-y-1.5 border-y border-dashed border-ink/20 py-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-ink/60">Billed to</span>
          <span className="font-medium">{invoice.residentName ?? "Resident"}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-ink/60">Unit</span>
          <span className="font-medium">{invoice.unitId ?? "—"}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-ink/60">Invoice period</span>
          <span className="font-medium">{invoice.period}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-ink/60">Paid via</span>
          <span className="font-medium">{invoice.method ?? "Nestura Pay"}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-ink/60">Paid on</span>
          <span className="font-medium">{invoice.paidAt ?? "Today"}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-ink/60">Status</span>
          <span className="font-medium text-success">Paid</span>
        </div>
      </div>

      <div className="pt-4">
        <div className="flex items-center justify-between border border-dashed border-ink/20 rounded-lg bg-surface-raised px-3 py-2">
          <span className="text-xs text-ink/60">Amount received</span>
          <span className="text-sm font-semibold">{formatMoney(invoice)}</span>
        </div>
        <p className="mt-4 text-center text-[11px] text-ink/50">
          Thank you for paying with Nestura · Support +94 11 234 5678
        </p>
      </div>
    </div>
  );
}