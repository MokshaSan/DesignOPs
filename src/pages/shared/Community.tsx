import { useState } from "react";
import { Megaphone } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/store/useStore";
import type { Notice } from "@/types";

const TONE: Record<Notice["category"], "danger" | "brand" | "neutral" | "info"> = {
  outage: "danger",
  event: "brand",
  policy: "neutral",
  holiday: "info",
};

export function CommunityBoard({ canPost = false }: { canPost?: boolean }) {
  const { notices, addNotice } = useStore();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<Notice["category"]>("event");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Community</h1>
        <p className="mt-1 text-sm text-tertiary">Events, outages, holidays and house rules — from management, in one feed.</p>
      </div>

      {canPost && (
        <Card>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!title.trim() || !body.trim()) return;
              addNotice({ title: title.trim(), body: body.trim(), category, author: "Building Ops" });
              setTitle("");
              setBody("");
            }}
          >
            <p className="text-sm font-semibold text-primary">Post a notice</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Headline"
                className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-primary"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Notice["category"])}
                className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-primary"
              >
                <option value="event">Event</option>
                <option value="outage">Outage</option>
                <option value="policy">Policy</option>
                <option value="holiday">Holiday</option>
              </select>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              placeholder="Details residents will see"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-primary"
            />
            <Button type="submit" disabled={!title.trim() || !body.trim()}>
              Publish
            </Button>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {notices.map((n) => (
          <Card key={n.id} className="relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-violet-600" />
            <div className="pl-3">
              <div className="flex flex-wrap items-center gap-2">
                <Megaphone size={14} className="text-brand-600" />
                <p className="text-sm font-semibold text-primary">{n.title}</p>
                <Badge tone={TONE[n.category]} className="capitalize">
                  {n.category}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-secondary">{n.body}</p>
              <p className="mt-2 text-[11px] text-tertiary">
                {n.author} · {n.postedAt}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ResidentCommunity() {
  return <CommunityBoard />;
}

export function OperatorCommunity() {
  return <CommunityBoard canPost />;
}
