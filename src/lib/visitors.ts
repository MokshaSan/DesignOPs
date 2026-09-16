import { supabase } from "@/lib/supabase";
import type { VisitorRequest, VisitorStatus, VisitorType } from "@/types";

type Row = {
  id: string;
  name: string;
  contact: string | null;
  type: string;
  unit_id: string;
  requested_for: string;
  window_start: string;
  window_end: string;
  risk_level: string;
  risk_reason: string;
  status: string;
  pass_code: string;
  host_name: string | null;
  destination: string | null;
  purpose: string | null;
  created_at: string;
};

function fromRow(row: Row): VisitorRequest {
  return {
    id: row.id,
    name: row.name,
    type: row.type as VisitorType,
    unitId: row.unit_id,
    hostName: row.host_name ?? undefined,
    destination: row.destination ?? undefined,
    purpose: row.purpose ?? undefined,
    requestedFor: row.requested_for,
    windowStart: row.window_start,
    windowEnd: row.window_end,
    riskLevel: row.risk_level as VisitorRequest["riskLevel"],
    riskReason: row.risk_reason,
    status: row.status as VisitorStatus,
    passCode: row.pass_code,
    createdAt: new Date(row.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

export async function persistVisitorRequest(v: VisitorRequest, contact?: string) {
  if (!supabase) return;
  await supabase.from("visitor_requests").upsert({
    id: v.id,
    name: v.name,
    contact: contact ?? null,
    type: v.type,
    unit_id: v.unitId,
    requested_for: v.requestedFor,
    window_start: v.windowStart,
    window_end: v.windowEnd,
    risk_level: v.riskLevel,
    risk_reason: v.riskReason,
    status: v.status,
    pass_code: v.passCode,
    host_name: v.hostName ?? null,
    destination: v.destination ?? null,
    purpose: v.purpose ?? null,
  });
}

export async function persistVisitorStatus(id: string, status: VisitorStatus) {
  if (!supabase) return;
  await supabase.from("visitor_requests").update({ status }).eq("id", id);
}

export async function fetchVisitorRequests(): Promise<VisitorRequest[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from("visitor_requests").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as Row[]).map(fromRow);
}
