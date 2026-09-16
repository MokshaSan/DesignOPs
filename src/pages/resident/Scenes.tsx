import { useState } from "react";
import { Plus } from "lucide-react";
import { useResidentScenes } from "@/store/useStore";
import { SceneCard } from "@/components/scenes/SceneCard";
import { Button } from "@/components/ui/Button";
import { SceneBuilderModal } from "@/components/scenes/SceneBuilderModal";
import { AIAutomationCard } from "@/components/ai/AIAutomationCard";

export function ResidentScenes() {
  const scenes = useResidentScenes();
  const [builderOpen, setBuilderOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Scenes</h1>
          <p className="mt-1 text-sm text-tertiary">One tap sets the mood. Build with Nestura or pick devices yourself.</p>
        </div>
        <Button onClick={() => setBuilderOpen(true)}>
          <Plus size={15} /> Create scene
        </Button>
      </div>

      <AIAutomationCard context="scenes and evening routines" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scenes.map((s) => (
          <SceneCard key={s.id} scene={s} />
        ))}
      </div>

      <SceneBuilderModal open={builderOpen} onClose={() => setBuilderOpen(false)} />
    </div>
  );
}
