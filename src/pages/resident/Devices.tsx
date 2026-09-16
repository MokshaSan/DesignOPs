import { useMemo, useState } from "react";
import { PowerOff, Plus } from "lucide-react";
import type { DeviceKind } from "@/types";
import { useStore, useResidentDevices } from "@/store/useStore";
import { DeviceTile } from "@/components/devices/DeviceTile";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { HOME_UNITS } from "@/lib/units";

const KINDS: DeviceKind[] = ["light", "ac", "curtain", "outlet", "door", "sensor", "camera"];
const ROOMS = ["Living Room", "Bedroom", "Kitchen", "Entrance", "Bathroom", "Balcony", "Study"];

const field =
  "h-10 rounded-lg border border-border bg-surface-raised px-3 text-sm text-primary outline-none focus:border-brand-400";

export function ResidentDevices() {
  const devices = useResidentDevices();
  const { addDevice, setUnitDevicesPower, accountUnitId, role } = useStore();
  const [name, setName] = useState("");
  const [room, setRoom] = useState(ROOMS[0]);
  const [kind, setKind] = useState<DeviceKind>("light");
  const [unitId, setUnitId] = useState(accountUnitId || "W001");

  const grouped = useMemo(() => {
    const map = new Map<string, typeof devices>();
    devices.forEach((d) => {
      const list = map.get(d.room) ?? [];
      list.push(d);
      map.set(d.room, list);
    });
    return Array.from(map.entries());
  }, [devices]);

  function add() {
    if (!name.trim()) return;
    addDevice({
      name: name.trim(),
      room,
      kind,
      unitId: role === "operator" || role === "developer" ? unitId : accountUnitId,
      power: false,
      value: kind === "ac" ? 24 : kind === "light" || kind === "curtain" ? 50 : undefined,
      unit: kind === "ac" ? "°C" : kind === "light" || kind === "curtain" ? "%" : undefined,
    });
    setName("");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Home devices</h1>
          <p className="mt-1 text-sm text-tertiary">
            {accountUnitId} · add, dim, lock, or remove anything this home controls. Scenes follow these devices.
          </p>
        </div>
        <Button variant="outline" onClick={() => setUnitDevicesPower(accountUnitId, false)}>
          <PowerOff size={15} /> All off
        </Button>
      </div>

      <Card className="space-y-3">
        <p className="text-sm font-semibold text-primary">Add a device</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <input className={field} placeholder="Name (e.g. Study lamp)" value={name} onChange={(e) => setName(e.target.value)} />
          <select className={field} value={room} onChange={(e) => setRoom(e.target.value)}>
            {ROOMS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <select className={field} value={kind} onChange={(e) => setKind(e.target.value as DeviceKind)}>
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
          {(role === "operator" || role === "developer") && (
            <select className={field} value={unitId} onChange={(e) => setUnitId(e.target.value)}>
              {HOME_UNITS.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          )}
          <Button onClick={add} disabled={!name.trim()}>
            <Plus size={15} /> Add
          </Button>
        </div>
      </Card>

      {devices.length === 0 && (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-tertiary">
          No devices on this unit yet. Add one above — Nestura scenes will pick it up immediately.
        </p>
      )}

      {grouped.map(([roomName, list]) => (
        <div key={roomName} className="space-y-3">
          <h2 className="text-sm font-semibold text-secondary">{roomName}</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((d) => (
              <DeviceTile key={d.id} device={d} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
