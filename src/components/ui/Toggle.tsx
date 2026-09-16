import { cx } from "@/lib/cx";

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  size?: "sm" | "md";
  disabled?: boolean;
  "aria-label"?: string;
}

export function Toggle({ checked, onChange, size = "md", disabled, ...aria }: ToggleProps) {
  const dims = size === "sm" ? "h-6 w-11" : "h-7 w-12";
  const knob = size === "sm" ? "h-5 w-5" : "h-5 w-5";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cx(
        dims,
        "relative inline-flex shrink-0 items-center rounded-full border-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:opacity-50",
        checked ? "border-violet-700 bg-[#7c3aed]" : "border-neutral-400 bg-neutral-300 dark:border-neutral-500 dark:bg-neutral-600",
      )}
      {...aria}
    >
      <span
        className={cx(knob, "inline-block rounded-full bg-white shadow-md ring-1 ring-black/10")}
        style={{
          transform: checked ? (size === "sm" ? "translateX(22px)" : "translateX(24px)") : "translateX(2px)",
          transition: "transform 0.2s ease",
        }}
      />
    </button>
  );
}
