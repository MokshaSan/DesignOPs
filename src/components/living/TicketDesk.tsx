import { useState, type FormEvent } from "react";
import { Wrench, MessageSquareWarning } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RestrictedNotice } from "@/components/ui/RestrictedNotice";
import { useStore } from "@/store/useStore";
import { TIER_PERMISSIONS } from "@/data/permissions";
import type { TicketKind, TicketStatus } from "@/types";
import { cx } from "@/lib/cx";

const MAINT_CATS = ["Plumbing", "Electrical", "AC", "Appliances", "Doors & locks", "Other"];
const COMPLAINT_CATS = ["Noise", "Parking", "Common area", "Security", "Cleaning", "Other"];

const STATUS_TONE: Record<TicketStatus, "warning" | "brand" | "info" | "success"> = {
  open: "warning",
  "in-progress": "brand",
  scheduled: "info",
  resolved: "success",
};

export function TicketDesk({ kind }: { kind: TicketKind }) {
  const { tickets, addTicket, residentTier, logActivity } = useStore();
  const canSubmit = TIER_PERMISSIONS[residentTier].services;
  const cats = kind === "maintenance" ? MAINT_CATS : COMPLAINT_CATS;
  const mine = tickets.filter((t) => t.kind === kind);
  const [category, setCategory] = useState(cats[0]);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const isMaint = kind === "maintenance";

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addTicket({ kind, category, title: title.trim(), detail: detail.trim(), priority });
    logActivity(`${isMaint ? "Maintenance" : "Complaint"} submitted: ${title.trim()}`);
    setTitle("");
    setDetail("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">{isMaint ? "Maintenance" : "Complaints"}</h1>
        <p className="mt-1 text-sm text-tertiary">
          {isMaint
            ? "Raise plumbing, electrical and in-unit work. Ops sees it instantly."
            : "Flag noise, parking and shared-space issues and track how they’re handled."}
        </p>
      </div>

      {canSubmit ? (
        <Card className="overflow-hidden border-brand-200/60 bg-gradient-to-br from-surface to-brand-50/40 dark:from-surface dark:to-brand-900/10">
          <form onSubmit={submit} className="space-y-4">
            <div className="flex items-center gap-2">
              {isMaint ? <Wrench size={16} className="text-brand-600" /> : <MessageSquareWarning size={16} className="text-brand-600" />}
              <p className="text-sm font-semibold text-primary">{isMaint ? "New request" : "New complaint"}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-medium text-tertiary">
                Category
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-primary"
                >
                  {cats.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-medium text-tertiary">
                Priority
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
            </div>
            <label className="block text-xs font-medium text-tertiary">
              Title
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isMaint ? "e.g. Bathroom leak under sink" : "e.g. Motorbike horn in basement"}
                className="mt-1 h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-primary"
              />
            </label>
            <label className="block text-xs font-medium text-tertiary">
              Details
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-primary"
              />
            </label>
            <Button type="submit" disabled={!title.trim()}>
              Submit
            </Button>
          </form>
        </Card>
      ) : (
        <RestrictedNotice message="Your tenant profile can’t submit building tickets. Ask the unit owner to raise this." />
      )}

      <div className="space-y-3">
        {mine.length === 0 && <p className="text-sm text-tertiary">Nothing filed yet.</p>}
        {mine.map((t) => (
          <Card key={t.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-primary">{t.title}</p>
                <Badge tone="neutral">{t.category}</Badge>
                <Badge tone={STATUS_TONE[t.status]} className="capitalize">
                  {t.status.replace("-", " ")}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-secondary">{t.detail}</p>
              <p className={cx("mt-1 text-[11px] text-tertiary")}>
                {t.createdAt} · {t.priority} priority
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
