import { CheckCheck } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getIcon } from "@/lib/icons";
import { cx } from "@/lib/cx";

const CATEGORY_TONE = {
  security: "text-danger bg-danger/10",
  energy: "text-warning bg-warning/10",
  maintenance: "text-accent bg-accent/10",
  ai: "text-brand-700 bg-brand-100 dark:text-brand-900",
  billing: "text-tertiary bg-surface-raised",
  visitor: "text-success bg-success/10",
};

export function ResidentNotifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Notifications</h1>
          <p className="mt-1 text-sm text-tertiary">Stay on top of security, energy, and maintenance updates.</p>
        </div>
        <Button size="sm" variant="outline" onClick={markAllNotificationsRead}>
          <CheckCheck size={14} /> Mark all read
        </Button>
      </div>

      <div className="space-y-2.5">
        {notifications.map((n) => {
          const Icon = getIcon(n.icon);
          return (
            <Card
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={cx("flex cursor-pointer items-start gap-3 transition-opacity", !n.read ? "opacity-100" : "opacity-60")}
            >
              <div className={cx("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", CATEGORY_TONE[n.category])}>
                <Icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-primary">{n.title}</p>
                  {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />}
                </div>
                <p className="mt-0.5 text-sm text-tertiary">{n.body}</p>
                <p className="mt-1 text-[11px] text-tertiary">{n.time}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
