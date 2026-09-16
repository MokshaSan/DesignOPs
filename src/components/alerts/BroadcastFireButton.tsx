import { Flame } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/store/useStore";

export function BroadcastFireButton() {
  const addAlert = useStore((s) => s.addAlert);

  return (
    <Button
      size="sm"
      variant="primary"
      className="bg-red-600 text-white hover:bg-red-700"
      onClick={() =>
        addAlert({
          severity: "critical",
          kind: "fire",
          broadcast: true,
          title: "FIRE ALARM",
          location: "The Meridian · all floors",
          aiConfidence: 99,
          aiNote: "Building operator issued a tower-wide fire warning. Use stairs, not lifts. Assemble at the ground courtyard.",
        })
      }
    >
      <Flame size={14} /> Fire warning to everyone
    </Button>
  );
}
