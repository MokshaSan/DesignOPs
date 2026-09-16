import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles, X } from "lucide-react";
import { NesturaMark } from "@/components/brand/NesturaMark";
import { useAIAssistant } from "@/hooks/useAI";
import { useStore } from "@/store/useStore";
import type { ChatMessage } from "@/types";
import { cx } from "@/lib/cx";

const RESIDENT_TIPS = ["Where's the gym?", "How do I get to the pool?", "Where is resident parking?", "Where do I collect a parcel?"];
const VISITOR_TIPS = ["How do I get to W002?", "Where is the gym?", "Visitor parking?", "Where is the mailroom?"];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function AIAssistantWidget() {
  const location = useLocation();
  const role = useStore((s) => s.role);
  const accountUnitId = useStore((s) => s.accountUnitId);
  const floorAmenities = useStore((s) => s.floorAmenities);
  const floorUnits = useStore((s) => s.floorUnits);
  const visitorMode = location.pathname.startsWith("/visitor");
  const effectiveRole = visitorMode ? "visitor" : role;
  const tips = visitorMode ? VISITOR_TIPS : RESIDENT_TIPS;
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { run, loading } = useAIAssistant();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: uid(),
        role: "assistant",
        content: visitorMode
          ? "Hi — I'm Nestura. I use indoor Beacons to walk you through The Meridian. Ask how to reach a unit (W001–W003), the gym, pool, or parking."
          : "Hi, I'm Nestura — your Smart Living assistant. Ask for Beacon directions around The Meridian, or anything about your home.",
        time: "",
      },
    ]);
  }, [visitorMode]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string) {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: uid(), role: "user", content: text, time: "" };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    const result = await run(text, effectiveRole, {
      unit: visitorMode ? "lobby" : accountUnitId,
      floorPlan: { amenities: floorAmenities, units: floorUnits.slice(0, 40) },
    });
    setMessages((m) => [
      ...m,
      {
        id: uid(),
        role: "assistant",
        content: result?.reply ?? "I couldn't reach the Nestura AI service. On Vercel, set OPENAI_API_KEY in project env, then redeploy. Locally run npm run dev so /api is proxied.",
        time: "",
      },
    ]);
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
            className="fixed bottom-24 right-4 z-50 flex h-[32rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl md:right-6"
          >
            <div className="brand-mark flex items-center gap-3 border-b border-border bg-brand-600 px-4 py-3.5 text-white">
              <NesturaMark size={32} className="rounded-full bg-white/10" />
              <div className="leading-tight">
                <p className="text-sm font-semibold">Nestura</p>
                <p className="text-[11px] text-white/75">{visitorMode ? "Visitor Beacon guide" : "Smart Living Assistant"}</p>
              </div>
              <button onClick={() => setOpen(false)} className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/15">
                <X size={15} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <div key={m.id} className={cx("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cx(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      m.role === "user" ? "rounded-br-sm bg-brand-600 text-white" : "rounded-bl-sm bg-surface-raised text-primary",
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-surface-raised px-3.5 py-3">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-tertiary"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-2">
                {tips.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-border px-2.5 py-1 text-xs text-secondary hover:bg-surface-raised"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={visitorMode ? "Ask for Beacon directions…" : "Ask Nestura anything..."}
                className="h-10 flex-1 rounded-lg border border-border bg-bg px-3 text-sm text-primary placeholder:text-tertiary focus:border-brand-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((v) => !v)}
        className="brand-mark fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-glow md:right-6"
        aria-label="Open Nestura assistant"
      >
        <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-brand-500" />
        {open ? <X size={20} /> : <Sparkles size={22} />}
      </motion.button>
    </>
  );
}
