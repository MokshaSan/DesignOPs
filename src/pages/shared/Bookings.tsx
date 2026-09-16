import { useEffect, useMemo, useState } from "react";
import { CalendarClock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RestrictedNotice } from "@/components/ui/RestrictedNotice";
import { useStore } from "@/store/useStore";
import { CURRENT_UNIT, FACILITIES } from "@/data/seed";
import { TIER_PERMISSIONS } from "@/data/permissions";

const SLOTS = ["07:00–08:00", "08:00–09:00", "10:00–11:00", "16:00–17:00", "18:00–20:00"];
const DATES = ["16 Sep", "17 Sep", "18 Sep", "19 Sep", "20 Sep", "21 Sep"];

export function ResidentBookings() {
  const { bookings, addBooking, cancelBooking, residentTier, logActivity } = useStore();
  const allowed = TIER_PERMISSIONS[residentTier].services;
  const mine = bookings.filter((b) => b.unitId === CURRENT_UNIT.id);
  const [facilityId, setFacilityId] = useState(FACILITIES[0].id);
  const [date, setDate] = useState(DATES[1]);
  const [slot, setSlot] = useState(SLOTS[1]);
  const [error, setError] = useState("");

  const facility = FACILITIES.find((f) => f.id === facilityId)!;
  const taken = useMemo(
    () =>
      new Set(
        bookings
          .filter((b) => b.facilityId === facilityId && b.date === date && b.status === "confirmed")
          .map((b) => b.slot),
      ),
    [bookings, facilityId, date],
  );

  useEffect(() => {
    if (taken.has(slot)) {
      const open = SLOTS.find((s) => !taken.has(s));
      if (open) setSlot(open);
    }
  }, [taken, slot]);

  if (!allowed) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-primary">Book facilities</h1>
        <RestrictedNotice message="Facility booking is managed by the unit owner on this demo tier." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Book facilities</h1>
        <p className="mt-1 text-sm text-tertiary">Gym, BBQ, party hall and pool — real slots, first-come.</p>
      </div>

      <Card>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const ok = addBooking({ facilityId, facilityName: facility.name, date, slot });
            if (!ok) {
              setError("That slot was just taken.");
              return;
            }
            setError("");
            logActivity(`Booked ${facility.name} ${date} ${slot}`);
          }}
        >
          <div className="flex items-center gap-2">
            <CalendarClock size={16} className="text-brand-600" />
            <p className="text-sm font-semibold text-primary">Reserve a slot</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <select
              value={facilityId}
              onChange={(e) => setFacilityId(e.target.value)}
              className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-primary"
            >
              {FACILITIES.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} · {f.location}
                </option>
              ))}
            </select>
            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-primary"
            >
              {DATES.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <select
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-primary"
            >
              {SLOTS.map((s) => (
                <option key={s} disabled={taken.has(s)}>
                  {s}
                  {taken.has(s) ? " · taken" : ""}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-xs text-danger">{error}</p>}
          <Button type="submit" disabled={taken.has(slot)}>
            Confirm booking
          </Button>
        </form>
      </Card>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-primary">Your bookings</p>
        {mine.length === 0 && <p className="text-sm text-tertiary">No reservations yet.</p>}
        {mine.map((b) => (
          <Card key={b.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">{b.facilityName}</p>
              <p className="text-xs text-tertiary">
                {b.date} · {b.slot}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={b.status === "confirmed" ? "success" : "neutral"} className="capitalize">
                {b.status}
              </Badge>
              {b.status === "confirmed" && (
                <Button size="sm" variant="ghost" onClick={() => cancelBooking(b.id)}>
                  Cancel
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function OperatorBookings() {
  const { bookings } = useStore();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Facility schedule</h1>
        <p className="mt-1 text-sm text-tertiary">Live reservations across amenities.</p>
      </div>
      <div className="space-y-3">
        {bookings.map((b) => (
          <Card key={b.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">{b.facilityName}</p>
              <p className="text-xs text-tertiary">
                {b.date} · {b.slot} · Unit {b.unitId} · {b.residentName}
              </p>
            </div>
            <Badge tone={b.status === "confirmed" ? "success" : "neutral"} className="capitalize">
              {b.status}
            </Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
