import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Home, Wrench, LineChart, QrCode, Moon, Sun } from "lucide-react";
import { useStore } from "@/store/useStore";
import type { Role } from "@/types";
import { cx } from "@/lib/cx";

const CARDS: { role: Role; title: string; desc: string; icon: typeof Home; to: string }[] = [
  { role: "resident", title: "Resident", desc: "Control your home, scenes, energy, and visitor access.", icon: Home, to: "/resident" },
  { role: "operator", title: "Building Operator", desc: "Monitor devices, alerts, maintenance and services building-wide.", icon: Wrench, to: "/operator" },
  { role: "developer", title: "Developer / Owner", desc: "Portfolio analytics, property configuration and ROI.", icon: LineChart, to: "/developer" },
];

export function Landing() {
  const navigate = useNavigate();
  const { setRole, theme, toggleTheme, visitors } = useStore();
  const sampleVisitor = visitors.find((v) => v.status === "approved") ?? visitors[0];

  function enter(role: Role, to: string) {
    setRole(role);
    navigate(to);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg bg-noise">
      <button
        onClick={toggleTheme}
        className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-secondary shadow-soft"
      >
        {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
      </button>

      <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-gradient-to-b from-brand-100/60 via-transparent to-transparent dark:from-brand-900/30" />

      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 text-white shadow-glow"
        >
          <Building2 size={28} />
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
          John Keells Properties
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-2 max-w-2xl text-balance text-4xl font-bold text-primary md:text-5xl"
        >
          Smart Living OS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 max-w-xl text-balance text-base text-secondary md:text-lg"
        >
          One connected platform for residents, building operators, and developers — with AI woven in from the
          ground up. Prototype for The Meridian, Tower A.
        </motion.p>

        <div className="mt-12 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {CARDS.map((c, i) => (
            <motion.button
              key={c.role}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.08 }}
              whileHover={{ y: -4 }}
              onClick={() => enter(c.role, c.to)}
              className={cx(
                "group flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-6 text-center shadow-soft transition-colors hover:border-brand-300",
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700 transition-transform group-hover:scale-110 dark:text-brand-900">
                <c.icon size={22} />
              </div>
              <p className="text-base font-semibold text-primary">{c.title}</p>
              <p className="text-sm text-tertiary">{c.desc}</p>
            </motion.button>
          ))}
        </div>

        {sampleVisitor && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => navigate(`/visitor/pass/${sampleVisitor.id}`)}
            className="mt-8 flex items-center gap-2 rounded-full border border-dashed border-border-strong px-4 py-2 text-xs font-medium text-tertiary hover:text-secondary"
          >
            <QrCode size={14} /> View a sample Visitor Pass instead
          </motion.button>
        )}

        <p className="mt-16 text-xs text-tertiary">Design competition prototype · Not an official John Keells product</p>
      </div>
    </div>
  );
}
