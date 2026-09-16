import { useEffect, useState } from "react";
import { Printer, MessageCircle, BellRing, CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Receipt } from "@/components/payments/Receipt";
import { useStore } from "@/store/useStore";
import { buildReceiptMessage, printReceipt, receiptNumber, whatsappDigits, whatsAppLink } from "@/lib/receipt";
import type { Invoice } from "@/types";

interface ReceiptModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  autoPrint?: boolean;
}

export function ReceiptModal({ invoice, onClose, autoPrint }: ReceiptModalProps) {
  return invoice ? <ReceiptModalInner invoice={invoice} onClose={onClose} autoPrint={autoPrint} /> : null;
}

function ReceiptModalInner({ invoice: inv, onClose, autoPrint }: { invoice: Invoice; onClose: () => void; autoPrint?: boolean }) {
  const { addNotification, logActivity } = useStore();
  const [sent, setSent] = useState<string | null>(null);

  useEffect(() => {
    if (!autoPrint) return;
    const t = window.setTimeout(() => printReceipt(), 200);
    return () => window.clearTimeout(t);
  }, [autoPrint]);

  function sendWhatsApp() {
    const phone = whatsappDigits(inv.phone);
    if (phone) {
      window.open(whatsAppLink(phone, buildReceiptMessage(inv)), "_blank", "noopener,noreferrer");
    }
    addNotification({
      icon: "CreditCard",
      title: "Receipt sent via WhatsApp",
      body: `Your ${inv.period} receipt (${receiptNumber(inv)}) was shared to Unit ${inv.unitId}.`,
      category: "billing",
    });
    logActivity(`Sent ${inv.period} receipt #${receiptNumber(inv)} via WhatsApp to unit ${inv.unitId}`);
    setSent("WhatsApp");
  }

  function notifyResident() {
    addNotification({
      icon: "CreditCard",
      title: "Payment receipt issued",
      body: `${inv.period} payment of ${inv.currency} ${inv.amount.toLocaleString()} confirmed for Unit ${inv.unitId}.`,
      category: "billing",
    });
    logActivity(`Notified unit ${inv.unitId} about ${inv.period} receipt #${receiptNumber(inv)}`);
    setSent("Notification");
  }

  return (
    <Modal open onClose={onClose} title="Payment receipt">
      <div className="space-y-4">
        <div className="max-h-[60vh] overflow-y-auto rounded-xl2 bg-surface-raised p-3">
          <Receipt invoice={inv} />
        </div>

        {sent && (
          <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
            <CheckCircle2 size={16} /> {sent === "WhatsApp" ? "Opened WhatsApp with the receipt and notified the resident." : "Resident notified about the receipt."}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => window.print()}>
            <Printer size={14} /> Print
          </Button>
          <Button size="sm" variant="outline" onClick={sendWhatsApp}>
            <MessageCircle size={14} /> WhatsApp receipt
          </Button>
          <Button size="sm" variant="secondary" onClick={notifyResident}>
            <BellRing size={14} /> Notify resident
          </Button>
          <Badge tone="success" className="ml-auto">
            {inv.status}
          </Badge>
        </div>
      </div>
    </Modal>
  );
}