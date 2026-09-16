import { useEffect, useState } from "react";

export interface AiHealth {
  ok: boolean;
  aiEnabled: boolean;
  model: string;
}

export function useAiHealth() {
  const [health, setHealth] = useState<AiHealth | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/health")
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((data: AiHealth) => {
        if (!cancelled) setHealth(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { health, error };
}
