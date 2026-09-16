import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Sparkles } from "lucide-react";
import { AIInsightCard } from "@/components/ai/AIInsightCard";
import { Button } from "@/components/ui/Button";
import { useStore, useResidentScenes } from "@/store/useStore";
import { nesturaSourceTitle } from "@/lib/aiLabel";
import { matchSceneForAutomation } from "@/lib/matchScene";
import { triggerFromText } from "@/components/ai/AIAutomationCard";
import { useToastStore } from "@/store/toastStore";

function liveSuggestion(input: {
  role: string;
  activityLog: { text: string }[];
  devices: { name: string; status: string; battery?: number }[];
  visitors: { name: string; status: string; unitId: string }[];
  alerts: { title: string; severity: string }[];
}) {
  if (input.alerts[0]) {
    return `${input.alerts[0].severity} alert is open: ${input.alerts[0].title}. Check the unit and acknowledge only after you verify.`;
  }
  const pending = input.visitors.find((v) => v.status === "pending");
  if (pending) {
    return `${pending.name} is waiting on access for unit ${pending.unitId}. Grant a timed window if you expect them.`;
  }
  const weak = input.devices.find((d) => d.status === "warning" || (d.battery != null && d.battery < 25));
  if (weak) {
    return `${weak.name} needs a check (${weak.status}${weak.battery != null ? `, battery ${weak.battery}%` : ""}).`;
  }
  if (input.activityLog[0]) {
    return `Latest activity: ${input.activityLog[0].text}. I can turn repeating actions into an automation if you want.`;
  }
  return input.role === "operator"
    ? "No open alerts. Ask Nestura for a route using the live floor plan, or simulate a sensor if you are testing."
    : "All quiet in your unit. Ask Nestura for directions, or issue a visitor ID from Access.";
}

export function LiveAISuggestion() {
  const navigate = useNavigate();
  const { role, activityLog, devices, visitors, alerts, accountUnitId, addAutomation } = useStore();
  const scenes = useResidentScenes();
  const payload = {
    role,
    activityLog: activityLog.slice(0, 12),
    devices: devices.slice(0, 12).map((d) => ({ name: d.name, kind: d.kind, status: d.status, health: d.health, battery: d.battery })),
    visitors: visitors.slice(0, 8).map((v) => ({ name: v.name, status: v.status, unitId: v.unitId })),
    alerts: alerts.filter((a) => !a.acknowledged).map((a) => ({ title: a.title, severity: a.severity })),
  };
  const [text, setText] = useState(() => liveSuggestion(payload));
  const [source, setSource] = useState("live");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const local = liveSuggestion(payload);
    setText(local);
    void fetch("/api/ai/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((data: { suggestion?: string; source?: string }) => {
        if (cancelled || !data.suggestion) return;
        setText(data.suggestion);
        setSource(data.source || "ai");
      })
      .catch(() => {
        if (!cancelled) setSource("live");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, alerts.length, visitors.length]);

  function turnIntoAutomation() {
    const scene = matchSceneForAutomation(scenes, text, text, text);
    if (!scene) {
      useToastStore.getState().pushToast({ title: "Create a scene first", body: "Automations run a scene on this unit.", tone: "warning" });
      return;
    }
    addAutomation({
      id: `auto-${Math.random().toString(36).slice(2, 9)}`,
      name: "From live suggestion",
      enabled: true,
      trigger: triggerFromText(text),
      extraConditions: [text],
      sceneId: scene.id,
      aiSuggested: true,
      unitId: accountUnitId,
    });
    useToastStore.getState().pushToast({
      title: "Automation saved",
      body: `Will run “${scene.name}”. Open Automation to toggle or Run.`,
      tone: "success",
    });
    if (role === "resident") navigate("/resident/automation");
  }

  return (
    <AIInsightCard
      title={nesturaSourceTitle(source, "Live suggestion")}
      actions={
        <>
          {role === "resident" && (
            <Button size="sm" onClick={turnIntoAutomation} disabled={loading}>
              <Sparkles size={13} /> Turn this into an automation
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setEditing((v) => !v)}>
            {editing ? "Done" : "Edit suggestion"}
          </Button>
        </>
      }
    >
      {loading ? (
        <p className="flex items-center gap-2 text-sm text-tertiary">
          <Loader2 size={14} className="animate-spin" /> Reading live building activity…
        </p>
      ) : editing ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-1 min-h-[88px] w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-primary"
        />
      ) : (
        <p>{text}</p>
      )}
    </AIInsightCard>
  );
}
