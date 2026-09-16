import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Users,
  Wrench,
  Code2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
  Activity,
} from "lucide-react";
import { NesturaLockup } from "@/components/brand/NesturaMark";
import type { Role } from "@/types";

const AUDIENCES: { role: Role; title: string; hint: string; icon: typeof Home; to: string }[] = [
  { role: "resident", title: "Resident", hint: "Your home", icon: Home, to: "/login?role=resident" },
  { role: "visitor", title: "Visitor", hint: "Request access", icon: Users, to: "/visitor/request" },
  { role: "operator", title: "Operator", hint: "Building ops", icon: Wrench, to: "/login?role=operator" },
  { role: "developer", title: "Developer", hint: "Portfolio", icon: Code2, to: "/login?role=developer" },
];

const FLOATING = [
  { icon: ShieldCheck, label: "Smart Access", left: "3%", top: "22%", x: 28, duration: 18, delay: 0 },
  { icon: Sparkles, label: "AI Automation", left: "82%", top: "18%", x: -22, duration: 20, delay: 2.4 },
  { icon: Zap, label: "Energy Intelligence", left: "4%", top: "62%", x: 18, duration: 19, delay: 1.1 },
  { icon: Activity, label: "Predictive Maintenance", left: "76%", top: "58%", x: -30, duration: 22, delay: 3.2 },
  { icon: Users, label: "Visitor Pass", left: "8%", top: "38%", x: 14, duration: 17, delay: 4.5 },
  { icon: Home, label: "Scenes", left: "88%", top: "36%", x: -16, duration: 21, delay: 0.6 },
  { icon: Sparkles, label: "Ambient Light", left: "18%", top: "72%", x: 24, duration: 23, delay: 5.8 },
  { icon: ShieldCheck, label: "Secure Entry", left: "70%", top: "28%", x: -20, duration: 16, delay: 7 },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function Landing() {
  const navigate = useNavigate();
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    const idle =
      "drop-shadow(0 0 18px rgba(255,255,255,0.28)) drop-shadow(0 0 42px rgba(165,180,252,0.28))";
    el.style.filter = idle;

    const enter = () => {
      el.style.filter =
        "drop-shadow(0 0 22px rgba(255,255,255,0.85)) drop-shadow(0 0 56px rgba(191,219,254,0.7)) drop-shadow(0 0 90px rgba(129,140,248,0.45))";
    };
    const leave = () => {
      el.style.filter = idle;
    };

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  function go(to: string) {
    navigate(to);
  }

  return (
    <div className="relative h-[100svh] overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <video className="h-full w-full object-cover" autoPlay muted loop playsInline preload="auto">
          <source src="/media/nestura-hero.mp4" type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-black/25" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet-800/30 via-purple-900/22 to-indigo-950/32" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
        {FLOATING.map((f) => (
          <motion.div
            key={f.label}
            className="absolute hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium tracking-wide text-white/70 backdrop-blur-sm md:flex"
            style={{ left: f.left, top: f.top }}
            initial={{ opacity: 0, x: 0, y: 10 }}
            animate={{
              opacity: [0, 0, 0.9, 0.9, 0],
              x: [0, f.x * 0.4, f.x, f.x * 0.5, 0],
              y: [10, -8, 6, -12, 10],
            }}
            transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: "easeInOut" }}
          >
            <f.icon size={12} className="text-violet-300" />
            {f.label}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex h-full flex-col px-5 pt-5 sm:px-8">
        <header className="flex items-center">
          <motion.button
            type="button"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            onClick={() => go("/")}
            className="rounded-lg transition duration-300 hover:drop-shadow-[0_0_18px_rgba(139,92,246,0.85)]"
            aria-label="Nestura"
          >
            <NesturaLockup height={56} onDark />
          </motion.button>
        </header>

        <div className="flex flex-1 flex-col items-center">
          <div className="mt-[6vh] flex flex-col items-center text-center sm:mt-[7vh]">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease }}
              className="flex flex-col items-center gap-3"
            >
              <span className="h-px w-16 bg-gradient-to-r from-blue-400 via-violet-400 to-transparent" />
              <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-white/70">
                Precision&nbsp;&nbsp;/&nbsp;&nbsp;Access&nbsp;&nbsp;/&nbsp;&nbsp;Intelligence
              </p>
            </motion.div>

            <motion.h1
              ref={titleRef}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.12, ease }}
              className="nestura-wordmark font-display relative mt-4 cursor-default select-none text-[clamp(56px,12.5vw,168px)] font-semibold leading-none tracking-[0.18em] text-white outline-none"
            >
              NESTURA
            </motion.h1>
          </div>

          <div className="mt-auto flex w-full flex-col items-center pb-5 sm:pb-7">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
              className="rounded-full bg-black/40 px-5 py-2 text-center text-[15px] leading-relaxed text-white/90"
            >
              One intelligent layer for home, visitors,
              <br className="hidden sm:block" /> operations and the portfolio.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26, ease }}
              className="mt-6 flex flex-col items-center gap-3 sm:flex-row"
            >
              <button
                onClick={() => go("/login")}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_-10px_rgba(99,102,241,0.9)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Enter Nestura <ArrowRight size={16} />
              </button>
              <button
                onClick={() => go("/visitor/request")}
                className="rounded-full border border-white/25 bg-white/5 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Request a Visit
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease }}
              className="relative mt-8 w-full max-w-6xl overflow-hidden rounded-[36px] border border-white/16 bg-black/45 px-3 py-4 sm:px-6 sm:py-5"
            >
              <div className="relative z-10 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
                {AUDIENCES.map((a) => (
                  <button
                    key={a.role}
                    onClick={() => go(a.to)}
                    className="flex items-center gap-4 rounded-2xl px-3 py-4 text-left transition-colors hover:bg-white/10"
                  >
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-white">
                      <a.icon size={20} />
                    </span>
                    <span>
                      <span className="block text-[15px] font-semibold text-white">{a.title}</span>
                      <span className="block text-xs text-white/55">{a.hint}</span>
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
