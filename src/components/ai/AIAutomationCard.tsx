import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Sparkles, Play } from "lucide-react";
import { AIInsightCard } from "@/components/ai/AIInsightCard";
import { Button } from "@/components/ui/Button";
import { useAIAutomationSuggest } from "@/hooks/useAI";
import { useStore, useResidentDevices, useResidentScenes } from "@/store/useStore";
import type { AutomationCondition } from "@/types";
import { useToastStore } from "@/store/toastStore";
import { nesturaSourceTitle } from "@/lib/aiLabel";
import { matchSceneForAutomation } from "@/lib/matchScene";

function uid() {
  return `auto-${Math.random().toString(36).slice(2, 9)}`;
}

export function triggerFromText(text: string): AutomationCondition {
  const t = text.toLowerCase();
  if (t.includes("arriv")) return { type: "arrival", label: text };
  if (t.includes("leav") || t.includes("depart")) return { type: "departure", label: text };
  if (t.includes("occup") || t.includes("empty") || t.includes("away")) return { type: "occupancy", label: text };
  const time = text.match(/\d{1,2}:\d{2}/);
  if (time) return { type: "time", label: `${time[0]} every day` };
  return { type: "time", label: text || "18:00 every day" };
}

export function AIAutomationCard({ context }: { context: string }) {
  const navigate = useNavigate();
  const role = useStore((s) => s.role);
  const activityLog = useStore((s) => s.activityLog);
  const accountUnitId = useStore((s) => s.accountUnitId);
  const addAutomation = useStore((s) => s.addAutomation);
  const fireAutomation = useStore((s) => s.fireAutomation);
  const scenes = useResidentScenes();
  const devices = useResidentDevices();
  const { run, loading } = useAIAutomationSuggest();
  const [suggestion, setSuggestion] = useState<{
    name: string;
    trigger: string;
    reasoning: string;
    confidence: number;
    source: string;
  } | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const matched = suggestion
    ? matchSceneForAutomation(scenes, suggestion.name, suggestion.trigger, suggestion.reasoning)
    : undefined;

  useEffect(() => {
    let cancelled = false;
    void run({
      activityLog: activityLog.slice(0, 20),
      unit: accountUnitId,
      context,
      devices: devices.slice(0, 12).map((d) => ({ name: d.name, kind: d.kind, room: d.room, power: d.power })),
    }).then((res) => {
      if (!cancelled && res) setSuggestion(res);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, accountUnitId, activityLog[0]?.id]);

  function accept() {
    if (!suggestion) return;
    const scene = matched;
    if (!scene) {
      useToastStore.getState().pushToast({ title: "No scene yet", body: "Create a scene first, then attach this automation.", tone: "warning" });
      return;
    }
    const id = uid();
    addAutomation({
      id,
      name: suggestion.name,
      enabled: true,
      trigger: triggerFromText(suggestion.trigger),
      extraConditions: [suggestion.reasoning],
      sceneId: scene.id,
      aiSuggested: true,
      confidence: suggestion.confidence,
      unitId: accountUnitId,
    });
    setSavedId(id);
    useToastStore.getState().pushToast({
      title: suggestion.name,
      body: `Saved on Automation. It will run “${scene.name}” for ${accountUnitId}.`,
      tone: "success",
    });
    if (role === "resident") navigate("/resident/automation");
  }

  return (
    <AIInsightCard
      title={nesturaSourceTitle(suggestion?.source, "Nestura automation")}
      actions={
        suggestion && !savedId ? (
          <Button size="sm" onClick={accept} disabled={loading}>
            <Sparkles size={13} /> Use this automation
          </Button>
        ) : savedId ? (
          <Button size="sm" variant="outline" onClick={() => fireAutomation(savedId)}>
            <Play size={13} /> Run now
          </Button>
        ) : null
      }
    >
      {loading && !suggestion ? (
        <p className="flex items-center gap-2 text-sm text-tertiary">
          <Loader2 size={14} className="animate-spin" /> Writing an automation from live activity…
        </p>
      ) : suggestion ? (
        <div className="space-y-1">
          <p className="font-medium text-primary">{suggestion.name}</p>
          <p className="text-sm text-secondary">
            IF {suggestion.trigger} THEN run “{matched?.name || "a scene you create"}”.
          </p>
          <p className="text-xs text-tertiary">{suggestion.reasoning}</p>
        </div>
      ) : (
        <p className="text-sm text-tertiary">Nestura will suggest an automation here once /api/ai is reachable.</p>
      )}
    </AIInsightCard>
  );
}
