import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useToastStore } from "@/store/toastStore";
import { cx } from "@/lib/cx";

const TONE = {
  success: "border-success/40 bg-surface text-primary",
  warning: "border-warning/40 bg-surface text-primary",
  danger: "border-danger/50 bg-surface text-primary",
  info: "border-brand-300 bg-surface text-primary",
};

export function ToastHost() {
  const { toasts, dismissToast } = useToastStore();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[90] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -10, x: 12 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            className={cx("pointer-events-auto rounded-xl border px-3.5 py-3 shadow-2xl", TONE[t.tone])}
          >
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{t.title}</p>
                <p className="mt-0.5 text-xs text-secondary">{t.body}</p>
              </div>
              <button onClick={() => dismissToast(t.id)} className="text-tertiary hover:text-primary" aria-label="Dismiss">
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
