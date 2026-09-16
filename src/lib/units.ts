export function canonicalUnitId(id?: string | null) {
  const raw = (id || "").trim();
  if (!raw || raw === "Tower A" || raw === "Portfolio") return raw || "W001";
  const u = raw.toUpperCase();
  if (u === "12A" || u === "W1" || u === "W01") return "W001";
  if (u === "18B" || u === "W2" || u === "W02") return "W002";
  if (u === "8F" || u === "W3" || u === "W03") return "W003";
  return raw;
}

export const HOME_UNITS = ["W001", "W002", "W003"] as const;
