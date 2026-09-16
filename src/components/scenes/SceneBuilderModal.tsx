import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Wand2, Loader2, Pencil, Check } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Toggle } from "@/components/ui/Toggle";
import { useAIScene } from "@/hooks/useAI";
import { useStore, useResidentDevices } from "@/store/useStore";
import { deviceIcon } from "@/lib/icons";
import type { Scene, SceneAction } from "@/types";

const PROMPT_EXAMPLES = ["Make my home ready for movie night", "Get things ready for guests arriving soon", "Cozy and warm for a rainy evening"];

function uid() {
  return `scene-${Math.random().toString(36).slice(2, 9)}`;
}

export function SceneBuilderModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addScene, runScene } = useStore();
  const devices = useResidentDevices();
  const { run, loading } = useAIScene();
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<{ name: string; actions: SceneAction[]; reasoning: string; source: string } | null>(null);
  const [editing, setEditing] = useState(false);

  async function generate() {
    if (!prompt.trim()) return;
    const res = await run(prompt, devices);
    if (!res) return;
    const enriched: SceneAction[] = res.actions.map((a) => {
      const device = devices.find((d) => d.id === a.deviceId);
      return {
        deviceId: a.deviceId,
        deviceName: device?.name ?? a.deviceId,
        kind: device?.kind ?? "light",
        action: a.action,
        power: a.power,
        value: a.value ?? undefined,
      };
    });
    setResult({ name: res.name, actions: enriched, reasoning: res.reasoning, source: res.source });
  }

  function reset() {
    setPrompt("");
    setResult(null);
    setEditing(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function createScene(alsoRun: boolean) {
    if (!result) return;
    const scene: Scene = {
      id: uid(),
      name: result.name,
      icon: "Sparkles",
      description: "Created with AI from your description.",
      actions: result.actions,
      aiGenerated: true,
      aiReasoning: result.reasoning,
    };
    addScene(scene);
    if (alsoRun) runScene(scene.id);
    handleClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="AI Scene Builder" maxWidth="max-w-xl">
      {!result && (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-secondary">Describe what you want</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Make my home ready for movie night"
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
          <Button className="w-full" onClick={generate} disabled={loading || !prompt.trim()}>
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Wand2 size={15} /> Generate Scene
              </>
            )}
          </Button>
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between">
            {editing ? (
              <input
                value={result.name}
                onChange={(e) => setResult({ ...result, name: e.target.value })}
                className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-base font-semibold text-primary focus:border-brand-400 focus:outline-none"
              />
            ) : (
              <h3 className="text-base font-semibold uppercase tracking-wide text-primary">{result.name}</h3>
            )}
            <Badge tone={result.source === "ai" ? "brand" : "neutral"}>
              <Sparkles size={11} /> {result.source === "ai" ? "AI generated" : "Offline demo mode"}
            </Badge>
          </div>

          <div className="space-y-2 rounded-xl border border-border bg-surface-raised p-3">
            {result.actions.length === 0 && <p className="text-sm text-tertiary">No matching devices found for this request.</p>}
            {result.actions.map((a, i) => {
              const Icon = deviceIcon(a.kind);
              return (
                <div key={i} className="flex items-center justify-between rounded-lg bg-surface px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:text-brand-900">
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

          <div className="rounded-xl bg-brand-50 p-3 text-xs leading-relaxed text-brand-800 dark:bg-brand-900/20 dark:text-brand-300">
            <span className="font-semibold">AI reasoning: </span>
            {result.reasoning}
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => createScene(true)}>
              <Check size={15} /> Create & Run
            </Button>
            <Button variant="outline" onClick={() => createScene(false)}>
              Save only
            </Button>
            <Button variant="ghost" onClick={() => setEditing((v) => !v)}>
              <Pencil size={14} /> {editing ? "Done" : "Edit"}
            </Button>
          </div>
          <button onClick={reset} className="text-xs text-tertiary hover:text-secondary hover:underline">
            ← Try a different description
          </button>
        </motion.div>
      )}
    </Modal>
  );
}
