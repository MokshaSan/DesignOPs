import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  Wrench,
  LineChart,
  QrCode,
  Moon,
  Sun,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
  Zap,
  Activity,
  Users,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { NesturaMark } from "@/components/brand/NesturaMark";
import type { Role } from "@/types";
import { cx } from "@/lib/cx";

const NAV_LINKS = ["Residents", "Operators", "Developers", "Visitors"];

const AUDIENCES: { role: Role; title: string; desc: string; icon: typeof Home; to: string; cta: string }[] = [
  { role: "resident", title: "Resident", desc: "Control your home, scenes, energy and visitor access from one place.", icon: Home, to: "/resident", cta: "Resident Login" },
  { role: "operator", title: "Building Operator", desc: "Monitor devices, alerts, maintenance and access, building-wide.", icon: Wrench, to: "/operator", cta: "Building Operations" },
  { role: "developer", title: "Developer", desc: "Portfolio analytics, energy trends and ROI across every property.", icon: LineChart, to: "/developer", cta: "Developer Portal" },
];

const BENEFITS = [
  { icon: ShieldCheck, label: "Smart Access" },
  { icon: Sparkles, label: "AI Automation" },
  { icon: Zap, label: "Energy Intelligence" },
  { icon: Activity, label: "Predictive Maintenance" },
  { icon: Users, label: "Visitor Management" },
];

export function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme, visitors } = useStore();
  const sampleVisitor = visitors.find((v) => v.status === "approved") ?? visitors[0];
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", menuOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [menuOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function goToLogin(role: Role) {
    navigate(`/login?role=${role}`);
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* ============ HERO ============ */}
      <section className="relative flex h-[100svh] min-h-[640px] w-full flex-col overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/media/nestura-hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col">
          {/* Nav */}
          <header className="mx-auto flex w-full max-w-6xl items-center gap-4 px-5 pt-6 md:px-8 md:pt-8">
            <div className="flex items-center gap-2.5">
              <NesturaMark size={34} />
              <span className="text-base font-bold tracking-tight text-white">Nestura</span>
            </div>

            <nav className="ml-10 hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-white/80 transition-opacity hover:opacity-70">
                  {l}
                </a>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              </button>
              <button
                onClick={() => goToLogin("resident")}
                className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 transition-transform hover:-translate-y-0.5 sm:inline-flex"
              >
                Resident Login
              </button>
              <button
                onClick={() => setMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm md:hidden"
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
            </div>
          </header>

          {/* Hero content */}
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-5 pb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
            >
              <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-neutral-900">New</span>
              One platform for residents, visitors &amp; operations
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl"
            >
              The operating system<br className="hidden sm:block" /> for modern living.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="max-w-xl text-balance text-base leading-relaxed text-white/80 md:text-lg"
            >
              Nestura unifies smart-home control, visitor access and building operations into one
              intelligent layer — built for residents, operators and developers alike.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-2 flex flex-wrap items-center justify-center gap-3"
            >
              <button
                onClick={() => goToLogin("resident")}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition-transform hover:-translate-y-0.5"
              >
                Resident Login
              </button>
              {sampleVisitor && (
                <button
                  onClick={() => navigate(`/visitor/pass/${sampleVisitor.id}`)}
                  className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  Request a Visit
                </button>
              )}
            </motion.div>
          </div>
        </div>

        {/* Mobile menu overlay */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-neutral-950/98 px-8 backdrop-blur-md"
            >
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute right-5 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
              {NAV_LINKS.map((l, i) => (
                <motion.a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i }}
                  className="text-3xl font-medium text-white"
                >
                  {l}
                </motion.a>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * NAV_LINKS.length }}
                onClick={() => goToLogin("resident")}
                className="mt-4 w-full max-w-xs rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-neutral-900"
              >
                Resident Login
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ============ AUDIENCE CARDS ============ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8" id="residents">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Four audiences, one layer</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-primary md:text-4xl">Built for everyone in the building</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {AUDIENCES.map((c, i) => (
            <motion.button
              key={c.role}
              id={c.role === "operator" ? "operators" : c.role === "developer" ? "developers" : undefined}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              onClick={() => goToLogin(c.role)}
              className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-surface p-6 text-left shadow-soft transition-colors hover:border-brand-300"
            >
              <div className="brand-mark flex h-11 w-11 items-center justify-center rounded-xl text-white transition-transform group-hover:scale-110">
                <c.icon size={20} />
              </div>
              <p className="text-base font-semibold text-primary">{c.title}</p>
              <p className="text-sm text-tertiary">{c.desc}</p>
              <span className="mt-1 text-xs font-semibold text-brand-600">{c.cta} →</span>
            </motion.button>
          ))}
        </div>

        <div id="visitors" className="mt-6 rounded-2xl border border-dashed border-border-strong bg-surface-raised p-6 text-center">
          <p className="text-sm font-semibold text-primary">Visiting someone at Nestura?</p>
          <p className="mt-1 text-sm text-tertiary">No account needed — request access and track it in real time.</p>
          {sampleVisitor && (
            <button
              onClick={() => navigate(`/visitor/pass/${sampleVisitor.id}`)}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-border-strong px-5 py-2.5 text-sm font-semibold text-secondary hover:bg-surface"
            >
              <QrCode size={14} /> View a sample Visitor Pass
            </button>
          )}
        </div>
      </section>

      {/* ============ BENEFITS STRIP ============ */}
      <section className="border-y border-border bg-surface-raised py-12">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-6 px-5 md:px-8">
          {BENEFITS.map((b) => (
            <div key={b.label} className="flex items-center gap-2.5 text-secondary">
              <b.icon size={17} className="text-brand-600" />
              <span className="text-sm font-medium">{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-10 text-center">
        <p className="text-xs text-tertiary">Design prototype · Nestura is a fictional platform built for a design competition</p>
      </footer>
    </div>
  );
}
