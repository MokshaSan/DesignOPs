import type { Invoice } from "@/types";

export function formatMoney(invoice: Invoice) {
  return `${invoice.currency} ${invoice.amount.toLocaleString()}`;
}

export function receiptNumber(invoice: Invoice) {
  const digits = invoice.id.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 6);
  return `NST-${digits}-${invoice.amount % 1000}`;
}

export function whatsappDigits(phone?: string) {
  return (phone ?? "").replace(/[^\d]/g, "");
}

export function buildReceiptMessage(invoice: Invoice) {
  const lines = [
    "Nestura Receipt",
    `The Meridian, Tower A`,
    `Unit ${invoice.unitId ?? "—"} · ${invoice.residentName ?? "Resident"}`,
    "",
    `Invoice: ${invoice.period}`,
    `Amount: ${formatMoney(invoice)}`,
    `Status: Paid`,
    `Paid via: ${invoice.method ?? "Nestura Pay"}`,
    `Paid on: ${invoice.paidAt ?? "Today"}`,
    `Receipt: ${receiptNumber(invoice)}`,
    "",
    "Thank you for paying with Nestura.",
  ];
  return lines.join("\n");
}

export function buildReminderMessage(invoice: Invoice) {
  const statusWord = invoice.status === "overdue" ? "overdue" : "due";
  const lines = [
    `Nestura · The Meridian Tower A`,
    `Dear ${invoice.residentName ?? "Resident"},`,
    "",
    `This is a friendly reminder that your ${invoice.period} invoice of ${formatMoney(invoice)} is ${statusWord}.`,
    `Please settle the balance by ${invoice.dueDate} to avoid any disruption.`,
    "",
    `Sincerely,`,
    `Building Management`,
  ];
  return lines.join("\n");
}

export function whatsAppLink(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Prints only the currently-visible receipt. Adds a scoping class to <body>
 * so the print stylesheet (`body.print-receipt`) hides the rest of the app.
 */
export function printReceipt() {
  document.body.classList.add("print-receipt");
  window.print();
  window.addEventListener("afterprint", () => document.body.classList.remove("print-receipt"), { once: true });
  window.setTimeout(() => document.body.classList.remove("print-receipt"), 2000);
}