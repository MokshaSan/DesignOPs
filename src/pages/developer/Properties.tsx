import { Building2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useStore } from "@/store/useStore";
import type { Property } from "@/types";

export function DeveloperProperties() {
  const { properties, addProperty, removeProperty } = useStore();
  const [addOpen, setAddOpen] = useState(false);
  const [propertyToRemove, setPropertyToRemove] = useState<Property | null>(null);
  const [name, setName] = useState("");
  const [units, setUnits] = useState("");

  function handleAddProperty(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !units) return;
    addProperty({ id: `property-${Date.now()}`, name: name.trim(), developer: "John Keells Properties", units: Number(units), uptime: 100, energyTrend: 0, engagementScore: 0 });
    setName("");
    setUnits("");
    setAddOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">My Properties</h1>
          <p className="mt-1 text-sm text-tertiary">Portfolio of John Keells developments running Smart Living OS.</p>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}><Plus size={14} /> Add property</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {properties.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:text-brand-900">
                <Building2 size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-primary">{p.name}</p>
                <p className="text-xs text-tertiary">{p.developer}</p>
                <p className="mt-1 text-xs text-tertiary">{p.units} units</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge tone={p.energyTrend < -10 ? "success" : "brand"}>{p.energyTrend}% energy</Badge>
                <button type="button" aria-label={`Remove ${p.name}`} onClick={() => setPropertyToRemove(p)} className="flex h-7 w-7 items-center justify-center rounded-lg text-tertiary hover:bg-danger/10 hover:text-danger">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-tertiary">Device uptime</span>
                <span className="font-semibold text-primary">{p.uptime}%</span>
              </div>
              <Progress value={p.uptime} tone={p.uptime > 95 ? "success" : "brand"} />
            </div>
            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-tertiary">Resident engagement</span>
                <span className="font-semibold text-primary">{p.engagementScore}%</span>
              </div>
              <Progress value={p.engagementScore} tone="brand" />
            </div>
          </Card>
        ))}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add property">
        <form onSubmit={handleAddProperty} className="space-y-4">
          <div>
            <label htmlFor="property-name" className="text-xs font-medium text-secondary">Property name</label>
            <input id="property-name" value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-primary outline-none focus:border-brand-500" placeholder="e.g. Harbour Residencies" required />
          </div>
          <div>
            <label htmlFor="property-units" className="text-xs font-medium text-secondary">Number of units</label>
            <input id="property-units" type="number" min="1" value={units} onChange={(event) => setUnits(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-primary outline-none focus:border-brand-500" placeholder="240" required />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm"><Plus size={14} /> Add property</Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(propertyToRemove)} onClose={() => setPropertyToRemove(null)} title="Remove property">
        <div className="space-y-4">
          <p className="text-sm leading-6 text-secondary">Are you sure you want to remove <span className="font-semibold text-primary">{propertyToRemove?.name}</span>? This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setPropertyToRemove(null)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={() => { if (propertyToRemove) removeProperty(propertyToRemove.id); setPropertyToRemove(null); }}><Trash2 size={14} /> Remove property</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
