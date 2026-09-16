import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { AIAssistantWidget } from "@/components/ai/AIAssistantWidget";
import { NesturaMark } from "@/components/brand/NesturaMark";
import { NAV_CONFIG } from "@/routes/navConfig";
import { getIcon } from "@/lib/icons";
import { cx } from "@/lib/cx";
import type { Role } from "@/types";

export function AppShell({
  role,
  title,
  children,
}: {
  role: Exclude<Role, "visitor">;
  title: string;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = NAV_CONFIG[role];

  return (
    <div className="flex h-screen bg-bg">
      <Sidebar role={role} />

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-surface md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.35 }}
            >
              <div className="flex h-16 items-center justify-between border-b border-border px-4">
                <div className="flex items-center gap-2.5">
                  <NesturaMark size={36} />
                  <p className="text-sm font-bold text-primary">Nestura</p>
                </div>
                <button onClick={() => setMobileOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-lg text-tertiary">
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 space-y-0.5 px-3 py-3">
                {items.map((item) => {
                  const Icon = getIcon(item.icon);
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        cx(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                          isActive ? "bg-brand-600 text-white dark:bg-brand-300" : "text-secondary hover:bg-surface-raised",
                        )
                      }
                    >
                      <Icon size={17} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto bg-noise">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">{children}</div>
        </main>
      </div>
      <AIAssistantWidget />
    </div>
  );
}
