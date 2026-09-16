import { NavLink } from "react-router-dom";
import { Building2 } from "lucide-react";
import { NAV_CONFIG, ROLE_LABEL } from "@/routes/navConfig";
import { getIcon } from "@/lib/icons";
import { cx } from "@/lib/cx";
import type { Role } from "@/types";
import { useStore } from "@/store/useStore";
import { TIER_LABEL } from "@/data/permissions";

export function Sidebar({ role }: { role: Exclude<Role, "visitor"> }) {
  const items = NAV_CONFIG[role];
  const residentTier = useStore((s) => s.residentTier);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface md:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-white shadow-glow dark:from-brand-300 dark:to-brand-200">
          <Building2 size={18} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold text-primary">Smart Living</p>
          <p className="text-[11px] font-medium text-tertiary">John Keells OS</p>
        </div>
      </div>

      <div className="px-4 pt-4">
        <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-tertiary">{ROLE_LABEL[role]}</p>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {items.map((item) => {
          const Icon = getIcon(item.icon);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cx(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-600 text-white shadow-sm shadow-brand-600/30 dark:bg-brand-300"
                    : "text-secondary hover:bg-surface-raised hover:text-primary",
                )
              }
            >
              <Icon size={17} strokeWidth={2.25} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-xl bg-surface-raised p-3">
          <p className="text-xs font-semibold text-primary">The Meridian, Tower A</p>
          <p className="mt-0.5 text-[11px] text-tertiary">Unit 12A · {role === "resident" ? TIER_LABEL[residentTier] : "—"}</p>
        </div>
      </div>
    </aside>
  );
}
