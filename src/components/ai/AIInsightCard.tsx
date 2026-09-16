import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { cx } from "@/lib/cx";

export function AIInsightCard({
  title = "AI Insight",
  children,
  actions,
  className,
}: {
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cx(
        "card-glow relative overflow-hidden rounded-xl2 border border-brand-200 bg-gradient-to-br from-brand-50 via-surface to-surface p-5 dark:border-brand-800/60",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow-glow">
          <Bot size={17} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-400">{title}</p>
          <div className="mt-1 text-sm leading-relaxed text-secondary">{children}</div>
          {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
        </div>
      </div>
    </motion.div>
  );
}
