import { useAiHealth } from "@/hooks/useAiHealth";
import { cx } from "@/lib/cx";

export function AiHealthChip() {
  const { health, error } = useAiHealth();

  if (error) {
    return (
      <span className="inline-flex items-center rounded-full border border-warning/40 bg-warning/10 px-2.5 py-1 text-[11px] font-semibold text-warning">
        Nestura API unreachable · using local fallback
      </span>
    );
  }
  if (!health) {
    return (
      <span className="inline-flex items-center rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-tertiary">
        Checking Nestura…
      </span>
    );
  }

  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        health.aiEnabled
          ? "border-success/40 bg-success/10 text-success"
          : "border-warning/40 bg-warning/10 text-warning",
      )}
    >
      {health.aiEnabled
        ? `Nestura · live model (${health.model || "gpt-4o-mini"})`
        : "Nestura · fallback (set OPENAI_API_KEY on Vercel, then redeploy)"}
    </span>
  );
}
