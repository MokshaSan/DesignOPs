import { useState } from "react";
import { Sparkles, Wrench, Truck, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

const SERVICES = [
  { id: "cleaning", name: "Cleaning", icon: Sparkles, desc: "Standard or deep clean, scheduled same-day." },
  { id: "maintenance", name: "Maintenance", icon: Wrench, desc: "In-house technician dispatch for repairs." },
  { id: "moving", name: "Moving Service", icon: Truck, desc: "Move-in / move-out coordination with the front desk." },
];

export function OperatorServices() {
  const [booked, setBooked] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<(typeof SERVICES)[number] | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Building Services</h1>
        <p className="mt-1 text-sm text-tertiary">Simulated service catalog — bookings here are demo data only.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {SERVICES.map((s) => (
          <Card key={s.id} className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:text-brand-900">
              <s.icon size={20} />
            </div>
            <p className="text-sm font-semibold text-primary">{s.name}</p>
            <p className="text-xs text-tertiary">{s.desc}</p>
            <Badge tone="success">Available</Badge>
            <Button size="sm" className="w-full" onClick={() => setConfirm(s)} disabled={booked === s.id}>
              {booked === s.id ? "Booked ✓" : "Book Service"}
            </Button>
          </Card>
        ))}
      </div>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Confirm Booking">
        {confirm && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:text-brand-900">
              <confirm.icon size={24} />
            </div>
            <p className="text-sm text-secondary">
              Book <strong className="text-primary">{confirm.name}</strong> for this property? This is a simulated
              booking for demo purposes.
            </p>
            <Button
              className="w-full"
              onClick={() => {
                setBooked(confirm.id);
                setConfirm(null);
              }}
            >
              <CheckCircle2 size={15} /> Confirm Booking
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
