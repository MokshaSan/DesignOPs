import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Wand2, Loader2, Pencil, Check, Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Toggle } from "@/components/ui/Toggle";
import { useAIScene } from "@/hooks/useAI";
import { useStore, useResidentDevices } from "@/store/useStore";
import { deviceIcon } from "@/lib/icons";
import { useToastStore } from "@/store/toastStore";
import type { Device, DeviceKind, Scene, SceneAction } from "@/types";

const PROMPT_EXAMPLES = ["Make my home ready for movie night", "Get things ready for guests arriving soon", "Cozy and warm for a rainy evening"];

function uid() {
  return `scene-${Math.random().toString(36).slice(2, 9)}`;
}

function remapActions(
  actions: { deviceId: string; action: string; power?: boolean; value?: number | null }[],
  devices: Device[],
): SceneAction[] {
  const out: SceneAction[] = [];
  for (const a of actions) {
    const device =
      devices.find((d) => d.id === a.deviceId) || devices.find((d) => d.name.toLowerCase() === String(a.deviceId).toLowerCase());
    if (!device) continue;
    out.push({
      deviceId: device.id,
      deviceName: device.name,
      kind: device.kind,
      action: a.action,
      power: a.power,
      value: a.value ?? undefined,
    });
  }
  return out;
}

function localScene(prompt: string, devices: Device[]) {
  const p = prompt.toLowerCase();
  const has = (...words: string[]) => words.some((w) => p.includes(w));
  const byKind = (kind: DeviceKind) => devices.filter((d) => d.kind === kind);
  const actions: { deviceId: string; action: string; power?: boolean; value?: number | null }[] = [];
  if (has("rain", "cozy", "warm", "evening")) {
    byKind("light").forEach((d) => actions.push({ deviceId: d.id, action: "Dim to 35%", power: true, value: 35 }));
    byKind("curtain").forEach((d) => actions.push({ deviceId: d.id, action: "Close", power: false, value: 0 }));
    byKind("ac").forEach((d) => actions.push({ deviceId: d.id, action: "Set to 24°C", power: true, value: 24 }));
    return { name: "Cozy Rainy Evening", reasoning: "Softer lights, closed curtains, and a warm setpoint.", actions };
  }
  if (has("movie", "film", "cinema")) {
    byKind("light").forEach((d) => actions.push({ deviceId: d.id, action: "Dim to 20%", power: true, value: 20 }));
    byKind("curtain").forEach((d) => actions.push({ deviceId: d.id, action: "Close", power: false, value: 0 }));
    byKind("ac").forEach((d) => actions.push({ deviceId: d.id, action: "Set to 23°C", power: true, value: 23 }));
    return { name: "Movie Night", reasoning: "Low light and a comfortable temperature for watching.", actions };
  }
  if (has("sleep", "night", "bed")) {
    byKind("light").forEach((d) => actions.push({ deviceId: d.id, action: "Off", power: false, value: 0 }));
    byKind("curtain").forEach((d) => actions.push({ deviceId: d.id, action: "Close", power: false, value: 0 }));
    byKind("ac").forEach((d) => actions.push({ deviceId: d.id, action: "Set to 24°C", power: true, value: 24 }));
    byKind("door").forEach((d) => actions.push({ deviceId: d.id, action: "Lock", power: true }));
    return { name: "Sleep Mode", reasoning: "Lights off, door locked, cooler sleep temperature.", actions };
  }
  if (has("guest", "party", "dinner")) {
    byKind("light").forEach((d) => actions.push({ deviceId: d.id, action: "On at 70%", power: true, value: 70 }));
    byKind("curtain").forEach((d) => actions.push({ deviceId: d.id, action: "Open", power: true, value: 100 }));
    byKind("ac").forEach((d) => actions.push({ deviceId: d.id, action: "Set to 23°C", power: true, value: 23 }));
    return { name: "Guests Arriving", reasoning: "Bright, welcoming rooms ready for people.", actions };
  }
  byKind("light").forEach((d) => actions.push({ deviceId: d.id, action: "On at 60%", power: true, value: 60 }));
  byKind("ac").forEach((d) => actions.push({ deviceId: d.id, action: "Set to 24°C", power: true, value: 24 }));
  return { name: prompt.slice(0, 28) || "Custom Scene", reasoning: "A comfortable default from your description.", actions };
}

export function SceneBuilderModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addScene, runScene, accountUnitId } = useStore();
  const devices = useResidentDevices();
  const controllable = useMemo(() => devices.filter((d) => d.kind !== "sensor"), [devices]);
  const { run, loading } = useAIScene();
  const [tab, setTab] = useState<"ai" | "manual">("ai");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<{ name: string; actions: SceneAction[]; reasoning: string; source: string } | null>(null);
  const [editing, setEditing] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualNote, setManualNote] = useState("");
  const [picks, setPicks] = useState<Record<string, { on: boolean; power: boolean; value: number }>>({});

  function reset() {
    setPrompt("");
    setResult(null);
    setEditing(false);
    setManualName("");
    setManualNote("");
    setPicks({});
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function generate() {
    if (!prompt.trim()) return;
    const res = await run(prompt, devices);
    const raw = res ?? { ...localScene(prompt, devices), source: "fallback" as const };
    const enriched = remapActions(raw.actions, devices);
    if (!enriched.length) {
      useToastStore.getState().pushToast({
        title: "No devices to control",
        body: "This unit has no lights, AC, curtains or doors for a scene.",
        tone: "warning",
      });
      return;
    }
    setResult({
      name: raw.name || "Custom Scene",
      actions: enriched,
      reasoning: raw.reasoning || "Built from your description and this unit’s devices.",
      source: res?.source === "ai" ? "ai" : "fallback",
    });
  }

  function save(actions: SceneAction[], name: string, description: string, ai: boolean, reasoning?: string, alsoRun?: boolean) {
    const scene: Scene = {
      id: uid(),
      name,
      icon: "Sparkles",
      description,
      actions,
      aiGenerated: ai,
      aiReasoning: reasoning,
      unitId: accountUnitId,
    };
    addScene(scene);
    if (alsoRun) runScene(scene.id);
    else
      useToastStore.getState().pushToast({
        title: "Scene saved",
        body: `${name} is ready on ${accountUnitId}.`,
        tone: "success",
      });
    handleClose();
  }

  function togglePick(d: Device) {
    setPicks((prev) => {
      const cur = prev[d.id];
      if (cur?.on) {
        const next = { ...prev };
        delete next[d.id];
        return next;
      }
      return {
        ...prev,
        [d.id]: { on: true, power: d.kind === "door" ? true : true, value: d.value ?? (d.kind === "ac" ? 24 : 70) },
      };
    });
  }

  function manualActions(): SceneAction[] {
    return controllable
      .filter((d) => picks[d.id]?.on)
      .map((d) => {
        const p = picks[d.id];
        const label =
          d.kind === "ac"
            ? `${p.power ? "Set to" : "Off"} ${p.value}°C`
            : d.kind === "door"
              ? p.power
                ? "Lock"
                : "Unlock"
              : p.power
                ? `On at ${p.value}%`
                : "Off";
        return {
          deviceId: d.id,
          deviceName: d.name,
          kind: d.kind,
          action: label,
          power: p.power,
          value: p.value,
        };
      });
  }

  return (
    <Modal open={open} onClose={handleClose} title="Create a scene" maxWidth="max-w-xl">
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-full bg-surface-raised p-1">
        <button
          type="button"
          onClick={() => setTab("ai")}
          className={`rounded-full py-2 text-sm font-semibold ${tab === "ai" ? "bg-[#7c3aed] text-white" : "text-secondary"}`}
        >
          <Sparkles size={14} className="mr-1 inline" /> AI
        </button>
        <button
          type="button"
          onClick={() => setTab("manual")}
          className={`rounded-full py-2 text-sm font-semibold ${tab === "manual" ? "bg-[#7c3aed] text-white" : "text-secondary"}`}
        >
          <Plus size={14} className="mr-1 inline" /> Manual
        </button>
      </div>

      {tab === "ai" && !result && (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-secondary">Describe the mood</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Cozy and warm for a rainy evening"
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-bg p-3 text-sm text-primary placeholder:text-tertiary focus:border-brand-400 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PROMPT_EXAMPLES.map((p) => (
              <button
                key={p}
                onClick={() => setPrompt(p)}
                className="rounded-full border border-border px-2.5 py-1 text-xs text-secondary hover:bg-surface-raised"
              >
                {p}
              </button>
            ))}
          </div>
          <Button className="w-full" onClick={() => void generate()} disabled={loading || !prompt.trim()}>
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Wand2 size={15} /> Generate with Nestura
              </>
            )}
          </Button>
        </div>
      )}

      {tab === "ai" && result && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            {editing ? (
              <input
                value={result.name}
                onChange={(e) => setResult({ ...result, name: e.target.value })}
                className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-base font-semibold text-primary focus:border-brand-400 focus:outline-none"
              />
            ) : (
              <h3 className="text-base font-semibold text-primary">{result.name}</h3>
            )}
            <Badge tone={result.source === "ai" ? "brand" : "neutral"}>
              <Sparkles size={11} /> {result.source === "ai" ? "AI" : "Local"}
            </Badge>
          </div>

          <div className="max-h-56 space-y-2 overflow-y-auto rounded-xl border border-border bg-surface-raised p-3">
            {result.actions.map((a, i) => {
              const Icon = deviceIcon(a.kind);
              return (
                <div key={`${a.deviceId}-${i}`} className="flex items-center justify-between rounded-lg bg-surface px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7c3aed] text-white">
                      <Icon size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">{a.deviceName}</p>
                      <p className="text-xs text-tertiary">{a.action}</p>
                    </div>
                  </div>
                  {editing && (
                    <Toggle
                      checked={!!a.power}
                      onChange={(v) =>
                        setResult({
                          ...result,
                          actions: result.actions.map((act, idx) => (idx === i ? { ...act, power: v } : act)),
                        })
                      }
                      size="sm"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <p className="rounded-xl bg-brand-50 p-3 text-xs leading-relaxed text-brand-800 dark:bg-brand-900/20 dark:text-brand-300">
            <span className="font-semibold">Why: </span>
            {result.reasoning}
          </p>

          <div className="flex flex-wrap gap-2">
            <Button className="flex-1" onClick={() => save(result.actions, result.name, "Created with AI from your description.", true, result.reasoning, true)}>
              <Check size={15} /> Create & Run
            </Button>
            <Button variant="outline" onClick={() => save(result.actions, result.name, "Created with AI from your description.", true, result.reasoning, false)}>
              Save only
            </Button>
            <Button variant="ghost" onClick={() => setEditing((v) => !v)}>
              <Pencil size={14} /> {editing ? "Done" : "Edit"}
            </Button>
          </div>
          <button onClick={() => setResult(null)} className="text-xs text-tertiary hover:underline">
            ← Try a different description
          </button>
        </motion.div>
      )}

      {tab === "manual" && (
        <div className="space-y-4">
          <input
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
            placeholder="Scene name — e.g. Study time"
            className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-sm text-primary placeholder:text-tertiary focus:border-brand-400 focus:outline-none"
          />
          <input
            value={manualNote}
            onChange={(e) => setManualNote(e.target.value)}
            placeholder="Short description (optional)"
            className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-sm text-primary placeholder:text-tertiary focus:border-brand-400 focus:outline-none"
          />
          <p className="text-xs font-medium text-secondary">Tap devices to include them, then set on/off and level.</p>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {controllable.map((d) => {
              const pick = picks[d.id];
              const Icon = deviceIcon(d.kind);
              return (
                <div key={d.id} className={`rounded-xl border p-3 ${pick?.on ? "border-brand-400 bg-brand-50/60 dark:bg-brand-900/20" : "border-border"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <button type="button" onClick={() => togglePick(d)} className="flex min-w-0 items-center gap-2.5 text-left">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7c3aed] text-white">
                        <Icon size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary">{d.name}</p>
                        <p className="text-xs text-tertiary">{d.room}</p>
                      </div>
                    </button>
                    {pick?.on && (
                      <Toggle
                        checked={pick.power}
                        onChange={(v) => setPicks((prev) => ({ ...prev, [d.id]: { ...prev[d.id], power: v } }))}
                        size="sm"
                      />
                    )}
                  </div>
                  {pick?.on && d.kind !== "door" && d.kind !== "outlet" && (
                    <input
                      type="range"
                      className="control-slider mt-3 w-full"
                      min={d.kind === "ac" ? 18 : 0}
                      max={d.kind === "ac" ? 30 : 100}
                      value={pick.value}
                      onChange={(e) =>
                        setPicks((prev) => ({ ...prev, [d.id]: { ...prev[d.id], value: Number(e.target.value) } }))
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              disabled={!manualName.trim() || manualActions().length === 0}
              onClick={() =>
                save(manualActions(), manualName.trim(), manualNote.trim() || "Created manually.", false, undefined, true)
              }
            >
              Save & Run
            </Button>
            <Button
              variant="outline"
              disabled={!manualName.trim() || manualActions().length === 0}
              onClick={() =>
                save(manualActions(), manualName.trim(), manualNote.trim() || "Created manually.", false, undefined, false)
              }
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
