export function nesturaSourceTitle(source?: string | null, job = "Nestura") {
  if (source === "ai") return `${job} · live model`;
  if (source === "fallback") return `${job} · fallback (no key / API error)`;
  if (source === "live") return `${job} · local rules (API unreachable)`;
  return job;
}
