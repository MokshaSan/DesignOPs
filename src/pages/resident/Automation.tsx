import { useState } from "react";
import { Plus, Sparkles, Zap, Clock, DoorOpen, Activity, Trash2 } from "lucide-react";
import { useStore, useResidentScenes, useResidentAutomations } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { Automation, AutomationCondition } from "@/types";
import { AIAutomationCard } from "@/components/ai/AIAutomationCard";

const TRIGGER_ICON: Record<AutomationCondition["type"], typeof Clock> = {
  time: Clock,
  arrival: DoorOpen,
  departure: DoorOpen,
  occupancy: Activity,
  sensor: Activity,
};

function uid() {
  return `auto-${Math.random().toString(36).slice(2, 9)}`;
}

export function ResidentAutomation() {
  const { toggleAutomation, addAutomation, deleteAutomation, fireAutomation, accountUnitId } = useStore();
  const scenes = useResidentScenes();
  const automations = useResidentAutomations();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [triggerType, setTriggerType] = useState<AutomationCondition["type"]>("time");
  const [timeValue, setTimeValue] = useState("18:00");
  const [sceneId, setSceneId] = useState(scenes[0]?.id ?? "");

  function create() {
    if (!name.trim() || !sceneId) return;
    const trigger: AutomationCondition =
      triggerType === "time"
        ? { type: "time", label: `${timeValue} every day` }
        : triggerType === "arrival"
          ? { type: "arrival", label: "Resident arrives home" }
          : triggerType === "departure"
            ? { type: "departure", label: "Resident leaves home" }
            : { type: "occupancy", label: "No occupancy detected for 30 minutes" };

    const automation: Automation = {
      id: uid(),
      name,
      enabled: true,
      trigger,
      extraConditions: [],
      sceneId,
    };
    addAutomation(automation);
    setOpen(false);
    setName("");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Automation</h1>
          <p className="mt-1 text-sm text-tertiary">Rules that run scenes automatically, based on triggers you control.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={15} /> Create Automation
        </Button>
      </div>

      <AIAutomationCard context={`automations for unit ${accountUnitId}`} />

      <div className="space-y-3">
        {automations.map((a) => {
          const scene = scenes.find((s) => s.id === a.sceneId);
          const Icon = TRIGGER_ICON[a.trigger.type];
          return (
            <Card key={a.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:text-brand-900">
                  <Icon size={17} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-primary">{a.name}</p>
                    {a.aiSuggested && (
                      <Badge tone="brand">
                        <Sparkles size={10} /> {a.confidence}% confidence
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-tertiary">
                    <span className="font-medium text-secondary">IF</span> {a.trigger.label}
                    {a.extraConditions.length > 0 && (
                      <>
                        {" "}
                        <span className="font-medium text-secondary">AND</span> {a.extraConditions.join(", ")}
                      </>
                    )}
                    {" · "}
                    <span className="font-medium text-secondary">THEN</span> run "{scene?.name}"
                  </p>
                  {a.lastTriggered && <p className="mt-1 text-[11px] text-tertiary">Last triggered: {a.lastTriggered}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button size="sm" variant="outline" onClick={() => fireAutomation(a.id)} disabled={!a.enabled}>
                  Run
                </Button>
                <Zap size={14} className={a.enabled ? "text-brand-600" : "text-tertiary"} />
                <Toggle checked={a.enabled} onChange={() => toggleAutomation(a.id)} aria-label={`Toggle ${a.name}`} />
                <button
                  type="button"
                  aria-label={`Delete ${a.name}`}
                  onClick={() => {
                    if (window.confirm(`Delete automation “${a.name}”?`)) deleteAutomation(a.id);
                  }}
                  className="rounded-lg p-1.5 text-tertiary hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create Automation">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-secondary">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Weekend Mornings"
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-primary placeholder:text-tertiary focus:border-brand-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-secondary">IF (trigger)</label>
            <select
              value={triggerType}
              onChange={(e) => setTriggerType(e.target.value as AutomationCondition["type"])}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-primary focus:border-brand-400 focus:outline-none"
            >
              <option value="time">At a specific time</option>
              <option value="arrival">When I arrive home</option>
              <option value="departure">When I leave home</option>
              <option value="occupancy">When no occupancy is detected</option>
            </select>
          </div>
          {triggerType === "time" && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-secondary">Time</label>
              <input
                type="time"
                value={timeValue}
                onChange={(e) => setTimeValue(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-primary focus:border-brand-400 focus:outline-none"
              />
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-secondary">THEN run scene</label>
            <select
              value={sceneId}
              onChange={(e) => setSceneId(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-primary focus:border-brand-400 focus:outline-none"
            >
              {scenes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <Button className="w-full" onClick={create} disabled={!name.trim()}>
            Create Automation
          </Button>
        </div>
      </Modal>
    </div>
  );
}
