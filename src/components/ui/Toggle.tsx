import { cx } from "@/lib/cx";

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  size?: "sm" | "md";
  disabled?: boolean;
  "aria-label"?: string;
}

export function Toggle({ checked, onChange, size = "md", disabled, ...aria }: ToggleProps) {
  const dims = size === "sm" ? "h-5 w-9" : "h-6 w-11";
  const knob = size === "sm" ? "h-3.5 w-3.5" : "h-4.5 w-4.5";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cx(
        dims,
        "relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:opacity-50",
        checked ? "bg-brand-600 dark:bg-brand-300" : "bg-surface-raised border border-border-strong",
      )}
      {...aria}
    >
      <span
        className={cx(
          knob,
          "inline-block transform rounded-full bg-white shadow transition-transform duration-200",
          checked ? (size === "sm" ? "translate-x-4.5" : "translate-x-6") : "translate-x-1",
        )}
        style={{
          transform: checked ? (size === "sm" ? "translateX(18px)" : "translateX(22px)") : "translateX(2px)",
        }}
      />
    </button>
  );
}
