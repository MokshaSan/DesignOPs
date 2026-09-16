import { Link } from "react-router-dom";
import { useStore } from "@/store/useStore";

export function SimulationBanner() {
  const role = useStore((s) => s.role);
  const to =
    role === "operator" ? "/operator/system" : role === "developer" ? "/developer/system" : "/resident/system";

  return (
    <div className="mb-4 rounded-xl border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-secondary md:text-sm">
      <span className="font-semibold text-primary">Demo simulation.</span> Locks, energy charts, and CCTV are not
      building hardware. Sensor % jitters every 9s. Nestura uses live app state (devices, visitors, alerts).
      {role !== "visitor" && (
        <>
          {" "}
          <Link to={to} className="font-medium text-brand-700 underline dark:text-brand-400">
            How Nestura works
          </Link>
        </>
      )}
    </div>
  );
}
