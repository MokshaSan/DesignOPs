import { useCallback, useState } from "react";
import type { Device } from "@/types";

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`AI request failed: ${res.status}`);
  return res.json();
}

export interface AISceneResult {
  name: string;
  actions: { deviceId: string; action: string; power?: boolean; value?: number | null }[];
  reasoning: string;
  source: "ai" | "fallback";
}

export interface AIEnergyResult {
  insight: string;
  recommendation: string;
  contributorPct: number;
  source: "ai" | "fallback";
}

export interface AIMaintenanceResult {
  risk: "low" | "medium" | "high" | "critical";
  reasoning: string;
  recommendation: string;
  source: "ai" | "fallback";
}

export interface AIAutomationResult {
  name: string;
  trigger: string;
  reasoning: string;
  confidence: number;
  source: "ai" | "fallback";
}

function useAsync<TArgs extends unknown[], TResult>(fn: (...args: TArgs) => Promise<TResult>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (...args: TArgs) => {
      setLoading(true);
      setError(null);
      try {
        return await fn(...args);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fn],
  );

  return { run, loading, error };
}

export function useAIScene() {
  return useAsync((prompt: string, devices: Device[]) =>
    post<AISceneResult>("/api/ai/scene", {
      prompt,
      devices: devices.map((d) => ({ id: d.id, name: d.name, kind: d.kind, room: d.room })),
    }),
  );
}

export function useAIAssistant() {
  return useAsync((message: string, role: string) => post<{ reply: string; source: string }>("/api/ai/assistant", { message, role }));
}

export function useAIEnergyInsight() {
  return useAsync((today: { label: string; kwh: number }[], week: { label: string; kwh: number }[]) =>
    post<AIEnergyResult>("/api/ai/energy-insight", { today, week }),
  );
}

export function useAIMaintenance() {
  return useAsync((device: Partial<Device>) => post<AIMaintenanceResult>("/api/ai/maintenance-insight", { device }));
}

export function useAIAutomationSuggest() {
  return useAsync((activityLog: { text: string; time: string }[]) =>
    post<AIAutomationResult>("/api/ai/automation-suggest", { activityLog }),
  );
}
