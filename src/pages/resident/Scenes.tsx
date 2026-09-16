import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useStore } from "@/store/useStore";
import { SceneCard } from "@/components/scenes/SceneCard";
import { Button } from "@/components/ui/Button";
import { SceneBuilderModal } from "@/components/scenes/SceneBuilderModal";

export function ResidentScenes() {
  const scenes = useStore((s) => s.scenes);
  const [builderOpen, setBuilderOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Scenes</h1>
          <p className="mt-1 text-sm text-tertiary">One tap to set the mood — or describe it and let AI build it for you.</p>
        </div>
        <Button onClick={() => setBuilderOpen(true)}>
          <Sparkles size={15} /> Create with AI
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scenes.map((s) => (
          <SceneCard key={s.id} scene={s} />
        ))}
      </div>

      <SceneBuilderModal open={builderOpen} onClose={() => setBuilderOpen(false)} />
    </div>
  );
}
