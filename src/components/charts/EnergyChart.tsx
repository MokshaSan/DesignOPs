import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { EnergyPoint } from "@/types";

export function EnergyChart({ data, height = 220 }: { data: EnergyPoint[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "rgb(var(--text-tertiary))" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "rgb(var(--text-tertiary))" }} axisLine={false} tickLine={false} width={32} />
        <Tooltip
          cursor={{ fill: "rgb(var(--brand-500) / 0.08)" }}
          contentStyle={{
            background: "rgb(var(--surface))",
            border: "1px solid rgb(var(--border))",
            borderRadius: 10,
            fontSize: 12,
            color: "rgb(var(--text-primary))",
          }}
          formatter={(v: number) => [`${v} kWh`, "Usage"]}
        />
        <Bar dataKey="kwh" radius={[6, 6, 0, 0]} fill="rgb(var(--brand-500))" maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}
