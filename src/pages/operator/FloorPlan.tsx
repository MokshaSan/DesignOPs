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
  ShieldCheck,
  ParkingCircle,
  BatteryCharging,
  PackageCheck,
  BookOpen,
  Sparkles,
  MapPin,
  DoorClosed,
  Plus,
  Pencil,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { BUILDING_LEVELS, AMENITIES, type Amenity } from "@/data/buildingMap";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cx } from "@/lib/cx";
import { useStore } from "@/store/useStore";
import type { FloorPlanAmenity, FloorPlanUnit, ResidentTier } from "@/types";

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

function amenityIcon(name: string): LucideIcon {
  const lower = name.toLowerCase();
  const known = AMENITIES.find(
    (a) => lower === a.name.toLowerCase() || a.id === name,
  );
  if (known?.id && AMENITY_ICON[known.id]) return AMENITY_ICON[known.id];
  if (lower.includes("parking") || lower.includes("car park")) return ParkingCircle;
  if (lower.includes("ev") || lower.includes("charging")) return BatteryCharging;
  if (lower.includes("storage") || lower.includes("locker")) return PackageCheck;
  if (lower.includes("security")) return ShieldCheck;
  if (lower.includes("yoga") || lower.includes("wellness")) return Sparkles;
  if (lower.includes("library") || lower.includes("lounge")) return BookOpen;
  if (lower.includes("business") || lower.includes("meeting")) return Laptop;
  if (lower.includes("elevator") || lower.includes("lift")) return DoorClosed;
  return MapPin;
}

function extraAmenitiesForLevel(levelCode: string): string[] {
  const level = BUILDING_LEVELS.find((l) => l.code === levelCode);
  if (!level) return levelCode === "B1" ? ["Resident Parking", "Storage Lockers"] : [];
  const knownIds = new Set([
    ...AMENITIES.map((a) => a.name),
    ...["Yoga & Wellness Studio", "Business Center & Meeting Rooms", "Library Lounge", "Security Office", "Visitor Parking", "EV Charging Bay", "Observation Terrace"],
  ]);
  return level.amenities.filter((n) => !knownIds.has(n));
}

const TIER_OPTIONS: ResidentTier[] = ["owner", "occupier", "tenant"];

interface UnitFormState {
  label: string;
  occupied: boolean;
  residentName: string;
  tier: ResidentTier;
}

interface AmenityFormState {
  name: string;
  hours: string;
  status: FloorPlanAmenity["status"];
}

export function OperatorFloorPlan() {
  const {
    floorUnits,
    floorAmenities,
    addFloorUnit,
    updateFloorUnit,
    deleteFloorUnit,
    addFloorAmenity,
    updateFloorAmenity,
    deleteFloorAmenity,
  } = useStore();

  const allLevels = [...BUILDING_LEVELS].sort((a, b) => a.order - b.order);
  const [selectedCode, setSelectedCode] = useState("L12");
  const selectedLevel = allLevels.find((l) => l.code === selectedCode) ?? allLevels[0];

  const units = floorUnits
    .filter((u) => u.levelCode === selectedCode)
    .sort((a, b) => a.label.localeCompare(b.label));
  const amenityList = floorAmenities.filter((a) => a.levelCode === selectedCode);
  const extras = extraAmenitiesForLevel(selectedCode);
  const isResidential = selectedLevel.order >= 3 && selectedLevel.order <= 20;

  const totalUnits = floorUnits.length;
  const occupiedUnits = floorUnits.filter((u) => u.occupied).length;

  const [unitModal, setUnitModal] = useState<"create" | FloorPlanUnit | null>(null);
  const [unitForm, setUnitForm] = useState<UnitFormState>({
    label: "",
    occupied: true,
    residentName: "",
    tier: "owner",
  });

  const [amenityModal, setAmenityModal] = useState<"create" | FloorPlanAmenity | null>(null);
  const [amenityForm, setAmenityForm] = useState<AmenityFormState>({
    name: "",
    hours: "24 / 7",
    status: "open",
  });

  function openCreateUnit() {
    const nextLetter = ["A", "B", "C", "D"].find(
      (l) => !floorUnits.some((u) => u.id === `${selectedLevel.order}${l}`),
    );
    setUnitForm({
      label: `${selectedLevel.order}${nextLetter ?? "A"}`,
      occupied: true,
      residentName: "",
      tier: "owner",
    });
    setUnitModal("create");
  }

  function openEditUnit(unit: FloorPlanUnit) {
    setUnitForm({
      label: unit.label,
      occupied: unit.occupied,
      residentName: unit.residentName,
      tier: unit.tier,
    });
    setUnitModal(unit);
  }

  function openCreateAmenity() {
    setAmenityForm({ name: "", hours: "24 / 7", status: "open" });
    setAmenityModal("create");
  }

  function openEditAmenity(amenity: FloorPlanAmenity) {
    setAmenityForm({ name: amenity.name, hours: amenity.hours, status: amenity.status });
    setAmenityModal(amenity);
  }

  function saveUnit() {
    if (!unitModal || !unitForm.label) return;
    if (unitModal === "create") {
      addFloorUnit({
        levelCode: selectedCode,
        label: unitForm.label.toUpperCase(),
        occupied: unitForm.occupied,
        residentName: unitForm.occupied ? unitForm.residentName.trim() || "Resident" : "",
        tier: unitForm.tier,
        devices: unitForm.occupied ? 3 : 0,
      });
    } else {
      updateFloorUnit(unitModal.id, {
        label: unitForm.label.toUpperCase(),
        occupied: unitForm.occupied,
        residentName: unitForm.occupied ? unitForm.residentName.trim() || "Resident" : "",
        tier: unitForm.tier,
      });
    }
    setUnitModal(null);
  }

  function saveAmenity() {
    if (!amenityModal || !amenityForm.name.trim()) return;
    if (amenityModal === "create") {
      addFloorAmenity({
        name: amenityForm.name.trim(),
        hours: amenityForm.hours,
        status: amenityForm.status,
        levelCode: selectedCode,
      });
    } else {
      updateFloorAmenity(amenityModal.id, amenityForm);
    }
    setAmenityModal(null);
  }

  function deleteUnit(id: string) {
    deleteFloorUnit(id);
    setUnitModal(null);
  }

  function deleteAmenity(id: string) {
    deleteFloorAmenity(id);
    setAmenityModal(null);
  }

  const inputCls =
    "h-10 w-full rounded-lg border border-border bg-bg px-3 text-sm text-primary placeholder:text-tertiary focus:border-brand-400 focus:outline-none";
  const labelCls = "mb-1 block text-xs font-medium text-secondary";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Floor Plan</h1>
          <p className="mt-1 text-sm text-tertiary">
            Tower A occupancy and amenity status — The Meridian.
          </p>
        </div>
        {isResidential ? (
          <Button onClick={openCreateUnit}>
            <Plus size={15} /> Add Unit
          </Button>
        ) : (
          <Button onClick={openCreateAmenity}>
            <Plus size={15} /> Add Amenity
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl2 border border-border bg-surface p-4 shadow-soft">
          <p className="text-xs font-medium text-tertiary">Total Units</p>
          <p className="mt-1 text-2xl font-semibold text-primary">{totalUnits}</p>
        </div>
        <div className="rounded-xl2 border border-border bg-surface p-4 shadow-soft">
          <p className="text-xs font-medium text-tertiary">Occupied</p>
          <p className="mt-1 text-2xl font-semibold text-success">{occupiedUnits}</p>
        </div>
        <div className="rounded-xl2 border border-border bg-surface p-4 shadow-soft">
          <p className="text-xs font-medium text-tertiary">Vacant</p>
          <p className="mt-1 text-2xl font-semibold text-tertiary">
            {totalUnits - occupiedUnits}
          </p>
        </div>
        <div className="rounded-xl2 border border-border bg-surface p-4 shadow-soft">
          <p className="text-xs font-medium text-tertiary">Occupancy</p>
          <p className="mt-1 text-2xl font-semibold text-primary">
            {totalUnits ? Math.round((occupiedUnits / totalUnits) * 100) : 0}%
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="hidden w-48 shrink-0 space-y-1 sm:block">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-tertiary">
            Floors
          </p>
          <div className="max-h-[480px] space-y-0.5 overflow-y-auto pr-1">
            {allLevels.map((l) => {
              const levelUnits = floorUnits.filter((u) => u.levelCode === l.code);
              const count = levelUnits.filter((u) => u.occupied).length;
              const total = levelUnits.length;
              return (
                <button
                  key={l.code}
                  onClick={() => setSelectedCode(l.code)}
                  className={cx(
                    "group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    selectedCode === l.code
                      ? "bg-brand-600 text-white shadow-sm shadow-brand-600/30 dark:bg-brand-300"
                      : "text-secondary hover:bg-surface-raised hover:text-primary",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs opacity-60">{l.code}</span>
                    <span className="truncate">{l.name}</span>
                  </span>
                  {total > 0 && (
                    <span
                      className={cx(
                        "ml-1 text-[10px] font-semibold",
                        selectedCode === l.code ? "text-white/80" : "text-tertiary",
                      )}
                    >
                      {count}/{total}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1">
          <Card className="min-h-[400px]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-primary">
                  {selectedLevel.name}
                </p>
                <p className="text-xs text-tertiary">{selectedLevel.code}</p>
              </div>
              <div className="flex items-center gap-2">
                {isResidential && (
                  <Badge tone="brand">
                    {units.filter((u) => u.occupied).length} of {units.length}{" "}
                    occupied
                  </Badge>
                )}
                {!isResidential && <Badge tone="success">Amenity Floor</Badge>}
              </div>
            </div>

            {isResidential ? (
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-tertiary">
                    Units
                  </p>
                  <span className="text-[11px] text-tertiary">Click a unit to edit</span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {units.length === 0 && (
                    <p className="col-span-full rounded-xl border border-dashed border-border p-4 text-center text-sm text-tertiary">
                      No units on this floor yet — click &quot;Add Unit&quot;.
                    </p>
                  )}
                  {units.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => openEditUnit(u)}
                      className={cx(
                        "group/unit flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-colors",
                        u.occupied
                          ? "border-success/40 bg-success/5 hover:border-success/60"
                          : "border-dashed border-border bg-surface-raised hover:border-tertiary",
                      )}
                    >
                      <span className="flex items-center gap-1.5">
                        <span
                          className={cx(
                            "text-base font-bold",
                            u.occupied ? "text-primary" : "text-tertiary",
                          )}
                        >
                          {u.id}
                        </span>
                        <Pencil size={11} className="text-tertiary opacity-0 transition-opacity group-hover/unit:opacity-100" />
                      </span>
                      <span
                        className={cx(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          u.occupied
                            ? "bg-success/15 text-success"
                            : "bg-surface-raised text-tertiary",
                        )}
                      >
                        <span
                          className={cx(
                            "h-1.5 w-1.5 rounded-full",
                            u.occupied ? "bg-success" : "bg-tertiary",
                          )}
                        />
                        {u.occupied ? "Occupied" : "Vacant"}
                      </span>
                      {u.occupied && (
                        <span className="truncate text-[10px] text-tertiary">
                          {u.residentName}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-tertiary">
                    Zones & Facilities
                  </p>
                  <span className="text-[11px] text-tertiary">Click a zone to edit</span>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {amenityList.length === 0 && (
                    <p className="col-span-full rounded-xl border border-dashed border-border p-4 text-center text-sm text-tertiary">
                      No amenities here yet — click &quot;Add Amenity&quot;.
                    </p>
                  )}
                  {amenityList.map((a) => {
                    const Icon = amenityIcon(a.name);
                    return (
                      <button
                        key={a.id}
                        onClick={() => openEditAmenity(a)}
                        className="group flex items-center gap-3 rounded-xl border border-border bg-surface-raised p-3 text-left transition-colors hover:border-brand-300"
                      >
                        <div className="brand-mark flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white">
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-primary">
                            {a.name}
                          </p>
                          <p className="truncate text-xs text-tertiary">
                            {a.hours}
                          </p>
                        </div>
                        <Badge
                          tone={
                            a.status === "open"
                              ? "success"
                              : a.status === "maintenance"
                                ? "warning"
                                : "neutral"
                          }
                          className="capitalize"
                        >
                          {a.status}
                        </Badge>
                      </button>
                    );
                  })}
                  {extras.map((name) => {
                    const Icon = amenityIcon(name);
                    return (
                      <div
                        key={name}
                        className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-surface p-3"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-tertiary">
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-primary">
                            {name}
                          </p>
                          <p className="truncate text-xs text-tertiary">
                            {selectedLevel.name}
                          </p>
                        </div>
                        <Badge tone="neutral">Built-in</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-1">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-tertiary">
                Legend
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-secondary">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm border-2 border-success/40 bg-success/5" />
                  Occupied
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm border-2 border-dashed border-border bg-surface-raised" />
                  Vacant
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-success/15" />
                  Open amenity
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-warning/15" />
                  Maintenance
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={!!unitModal}
        onClose={() => setUnitModal(null)}
        title={unitModal === "create" ? "Add Unit" : "Edit Unit"}
      >
        {unitModal && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Unit label</label>
                <input
                  className={inputCls}
                  value={unitForm.label}
                  onChange={(e) => setUnitForm({ ...unitForm, label: e.target.value })}
                  placeholder="e.g. 12A"
                />
              </div>
              <div>
                <label className={labelCls}>Occupancy</label>
                <div className="flex gap-2">
                  {["occupied", "vacant"].map((opt) => {
                    const value = opt === "occupied";
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setUnitForm({ ...unitForm, occupied: value })}
                        className={cx(
                          "h-10 flex-1 rounded-lg border text-sm font-medium capitalize transition-colors",
                          unitForm.occupied === value
                            ? value
                              ? "border-success/50 bg-success/10 text-success"
                              : "border-border-strong bg-surface-raised text-tertiary"
                            : "border-border text-tertiary hover:bg-surface-raised",
                        )}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            {unitForm.occupied && (
              <>
                <div>
                  <label className={labelCls}>Resident name</label>
                  <input
                    className={inputCls}
                    value={unitForm.residentName}
                    onChange={(e) => setUnitForm({ ...unitForm, residentName: e.target.value })}
                    placeholder="Resident's full name"
                  />
                </div>
                <div>
                  <label className={labelCls}>Tier</label>
                  <div className="flex gap-2">
                    {TIER_OPTIONS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setUnitForm({ ...unitForm, tier: t })}
                        className={cx(
                          "h-10 flex-1 rounded-lg border text-sm font-medium capitalize transition-colors",
                          unitForm.tier === t
                            ? "border-brand-400 bg-brand-100 text-brand-700 dark:text-brand-900"
                            : "border-border text-tertiary hover:bg-surface-raised",
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            <div className="flex items-center justify-between gap-2 pt-1">
              {unitModal !== "create" ? (
                <Button variant="danger" onClick={() => deleteUnit(unitModal.id)}>
                  <Trash2 size={14} /> Delete
                </Button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setUnitModal(null)}>
                  Cancel
                </Button>
                <Button onClick={saveUnit} disabled={!unitForm.label.trim()}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!amenityModal}
        onClose={() => setAmenityModal(null)}
        title={amenityModal === "create" ? "Add Amenity" : "Edit Amenity"}
      >
        {amenityModal && (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Name</label>
              <input
                className={inputCls}
                value={amenityForm.name}
                onChange={(e) => setAmenityForm({ ...amenityForm, name: e.target.value })}
                placeholder="e.g. Rooftop Garden"
              />
            </div>
            <div>
              <label className={labelCls}>Hours</label>
              <input
                className={inputCls}
                value={amenityForm.hours}
                onChange={(e) => setAmenityForm({ ...amenityForm, hours: e.target.value })}
                placeholder="e.g. 8:00 AM – 8:00 PM"
              />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <div className="flex gap-2">
                {(["open", "maintenance", "closed"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setAmenityForm({ ...amenityForm, status: s })}
                    className={cx(
                      "h-10 flex-1 rounded-lg border text-sm font-medium capitalize transition-colors",
                      amenityForm.status === s
                        ? s === "open"
                          ? "border-success/50 bg-success/10 text-success"
                          : s === "maintenance"
                            ? "border-warning/50 bg-warning/10 text-warning"
                            : "border-border-strong bg-surface-raised text-tertiary"
                        : "border-border text-tertiary hover:bg-surface-raised",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
              {amenityModal !== "create" ? (
                <Button variant="danger" onClick={() => deleteAmenity(amenityModal.id)}>
                  <Trash2 size={14} /> Delete
                </Button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setAmenityModal(null)}>
                  Cancel
                </Button>
                <Button onClick={saveAmenity} disabled={!amenityForm.name.trim()}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}