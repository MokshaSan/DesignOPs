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
  ArrowUpRight,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { NesturaLockup } from "@/components/brand/NesturaMark";
import type { Role } from "@/types";

const NAV_LINKS = [
  { label: "Residents", href: "#residents" },
  { label: "Operators", href: "#operators" },
  { label: "Developers", href: "#developers" },
  { label: "Visitors", href: "#visitors" },
];

const AUDIENCES: { role: Role; title: string; desc: string; icon: typeof Home; cta: string }[] = [
  { role: "resident", title: "Resident", desc: "Your home, scenes, energy and visitor access — one calm layer.", icon: Home, cta: "Enter home" },
  { role: "operator", title: "Building Operator", desc: "Live status, devices, maintenance, visitors and CCTV.", icon: Wrench, cta: "Open operations" },
  { role: "developer", title: "Developer", desc: "Portfolio intelligence across every Nestura property.", icon: LineChart, cta: "View portfolio" },
];

const BENEFITS = [
  { icon: ShieldCheck, label: "Smart Access" },
  { icon: Sparkles, label: "AI Automation" },
  { icon: Zap, label: "Energy Intelligence" },
  { icon: Activity, label: "Predictive Maintenance" },
  { icon: Users, label: "Visitor Management" },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useStore();
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
    <div className="min-h-screen bg-neutral-950">
      <section className="relative flex h-[100svh] min-h-[640px] w-full flex-col overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video className="h-full w-full object-cover" autoPlay muted loop playsInline preload="auto">
            <source src="/media/nestura-hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/25" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-violet-950/40 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col px-4 pb-8 pt-4 md:px-6">
          <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="mx-auto flex w-full max-w-6xl items-center gap-4 rounded-full border border-white/10 bg-black/20 px-3 py-2 backdrop-blur-md md:px-4"
          >
            <NesturaLockup height={34} onDark />
            <nav className="ml-2 hidden items-center gap-7 md:flex">
              {NAV_LINKS.map((l) => (
                <a key={l.label} href={l.href} className="text-[13px] text-white/75 transition-colors hover:text-white">
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              </button>
              <button
                onClick={() => goToLogin("resident")}
                className="hidden items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 sm:inline-flex"
              >
                Sign in
              </button>
              <button
                onClick={() => setMenuOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-white md:hidden"
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
            </div>
          </motion.header>

          <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease }}
              className="text-[11px] font-medium uppercase tracking-[0.34em] text-violet-200/90"
            >
              Precision · Access · Intelligence
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.14, ease }}
              className="font-display mt-5 text-[clamp(44px,9vw,108px)] font-semibold leading-none tracking-[0.22em] text-white"
              style={{ textShadow: "0 0 48px rgba(167,139,250,0.45), 0 0 120px rgba(124,58,237,0.28)" }}
            >
              NESTURA
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.22, ease }}
              className="mt-5 text-sm font-medium uppercase tracking-[0.28em] text-white/85 md:text-base"
            >
              Stop switching apps — start living
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.28, ease }}
              className="mt-3 max-w-md text-sm leading-relaxed text-white/70"
            >
              One intelligent layer for home, visitors, operations and the portfolio.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.36, ease }}
              className="mt-9 flex flex-wrap items-center justify-center gap-3"
            >
              <button
                onClick={() => goToLogin("resident")}
                className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_50px_-12px_rgba(139,92,246,0.95)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Enter Nestura <ArrowUpRight size={16} />
              </button>
              <button
                onClick={() => navigate("/visitor/request")}
                className="rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Request a Visit
              </button>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-neutral-950 px-8"
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
                  key={l.label}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i }}
                  className="text-3xl font-medium text-white"
                >
                  {l.label}
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="bg-bg px-5 py-20 md:px-8" id="residents">
        <div className="mx-auto w-full max-w-6xl">
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
                className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-surface p-6 text-left transition-colors hover:border-brand-300"
              >
                <div className="brand-mark flex h-11 w-11 items-center justify-center rounded-xl text-white">
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
            <p className="mt-1 text-sm text-tertiary">Request access. The resident reviews it, then Building Operations.</p>
            <button
              onClick={() => navigate("/visitor/request")}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-border-strong px-5 py-2.5 text-sm font-semibold text-secondary hover:bg-surface"
            >
              <QrCode size={14} /> Request a Visit
            </button>
          </div>
        </div>
      </section>

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

      <footer className="bg-bg py-10 text-center">
        <p className="text-xs text-tertiary">Nestura Smart Living OS · The Meridian</p>
      </footer>
    </div>
  );
}
