import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import type { Scene } from "@/types";
import { getIcon } from "@/lib/icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useStore } from "@/store/useStore";
import { cx } from "@/lib/cx";

export function SceneCard({ scene }: { scene: Scene }) {
  const { runScene, lastActivatedScene } = useStore();
  const Icon = getIcon(scene.icon);
  const justRan = lastActivatedScene === scene.id;

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className={cx(
        "relative flex flex-col justify-between rounded-xl2 border bg-surface p-5 shadow-soft transition-colors",
        justRan ? "border-brand-400 ring-2 ring-brand-200 dark:ring-brand-800" : "border-border",
      )}
    >
      {scene.aiGenerated && (
        <Badge tone="brand" className="absolute right-4 top-4">
          <Sparkles size={11} /> AI
        </Badge>
      )}
      <div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:text-brand-900">
          <Icon size={20} />
        </div>
        <h3 className="mt-3 text-base font-semibold text-primary">{scene.name}</h3>
        <p className="mt-1 text-sm text-tertiary">{scene.description}</p>
        <ul className="mt-3 space-y-1">
          {scene.actions.slice(0, 3).map((a, i) => (
            <li key={i} className="text-xs text-secondary">
              <span className="font-medium text-primary">{a.deviceName}</span> → {a.action}
            </li>
          ))}
          {scene.actions.length > 3 && <li className="text-xs text-tertiary">+{scene.actions.length - 3} more</li>}
        </ul>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[11px] text-tertiary">{scene.lastRun ? `Last run: ${scene.lastRun}` : "Never run"}</span>
        <Button size="sm" onClick={() => runScene(scene.id)}>
          <Play size={13} /> Run
        </Button>
      </div>
    </motion.div>
  );
}
