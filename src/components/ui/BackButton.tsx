import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cx } from "@/lib/cx";

export function BackButton({
  to = "/",
  label = "Back",
  className,
  light = false,
}: {
  to?: string;
  label?: string;
  className?: string;
  light?: boolean;
}) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => {
        if (to) navigate(to);
        else if (window.history.length > 1) navigate(-1);
        else navigate("/");
      }}
      className={cx(
        "inline-flex items-center gap-1.5 text-sm font-medium transition-colors",
        light ? "text-white/80 hover:text-white" : "text-secondary hover:text-primary",
        className,
      )}
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
}
