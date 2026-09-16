import { useStore } from "@/store/useStore";
import { VisitorRequestCard } from "@/components/visitors/VisitorRequestCard";

export function OperatorVisitors() {
  const { visitors } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Building Visitors</h1>
        <p className="mt-1 text-sm text-tertiary">All active and pending visitor access across Tower A.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visitors.map((v) => (
          <VisitorRequestCard key={v.id} visitor={v} showUnit />
        ))}
      </div>
    </div>
  );
}
