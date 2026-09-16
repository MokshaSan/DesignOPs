import { useState } from "react";
import {
  Dumbbell,
  Waves,
  UtensilsCrossed,
  Users,
  Package,
  Laptop,
  BedDouble,
  Car,
  Blocks,
  MapPin,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { AMENITIES, BUILDING_LEVELS, type Amenity } from "@/data/buildingMap";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const AMENITY_ICON: Record<string, LucideIcon> = {
  gym: Dumbbell,
  pool: Waves,
  "sky-lounge": UtensilsCrossed,
  concierge: Users,
  mailroom: Package,
  coworking: Laptop,
  "guest-suites": BedDouble,
  parking: Car,
  "kids-play": Blocks,
};

function levelName(code: string) {
  return BUILDING_LEVELS.find((l) => l.code === code)?.name ?? code;
}

export function ResidentFacilities() {
  const [active, setActive] = useState<Amenity | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Facilities</h1>
        <p className="mt-1 text-sm text-tertiary">Amenities at The Meridian, Tower A — directions from unit W001.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AMENITIES.map((a) => {
          const Icon = AMENITY_ICON[a.id] ?? MapPin;
          const bookable = a.hours?.toLowerCase().includes("required");
          return (
            <Card
              key={a.id}
              className="flex cursor-pointer flex-col gap-3 transition-colors hover:border-brand-300"
              onClick={() => setActive(a)}
            >
              <div className="flex items-start justify-between">
                <div className="brand-mark flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <Icon size={20} />
                </div>
                <Badge tone={bookable ? "warning" : "success"}>{bookable ? "Booking required" : "Open access"}</Badge>
              </div>
              <div>
                <p className="text-base font-semibold text-primary">{a.name}</p>
                <p className="mt-0.5 text-xs text-tertiary">{levelName(a.levelCode)}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-secondary">
                <Clock size={12} /> {a.hours}
              </div>
            </Card>
          );
        })}
      </div>

      {active && (
        <Card className="border-brand-200 dark:border-brand-800/60">
          <div className="flex items-start gap-4">
            <div className="brand-mark flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
              {(() => {
                const Icon = AMENITY_ICON[active.id] ?? MapPin;
                return <Icon size={22} />;
              })()}
            </div>
            <div>
              <p className="text-base font-semibold text-primary">{active.name}</p>
              <p className="text-xs text-tertiary">
                {levelName(active.levelCode)} · {active.hours}
              </p>
              <p className="mt-2 flex items-start gap-1.5 text-sm text-secondary">
                <MapPin size={14} className="mt-0.5 shrink-0 text-brand-600" /> {active.directions}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
