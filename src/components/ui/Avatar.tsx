import { cx } from "@/lib/cx";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-14 w-14 text-lg" };

export function Avatar({ name, size = "md", className }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className={cx(
        sizes[size],
        "flex items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-800 font-semibold text-white dark:from-brand-300 dark:to-brand-200",
        className,
      )}
    >
      {initials}
    </div>
  );
}
