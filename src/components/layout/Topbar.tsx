import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Menu, Moon, Sun, LogOut } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Avatar } from "@/components/ui/Avatar";
import { BackButton } from "@/components/ui/BackButton";
import { ROLE_LABEL } from "@/routes/navConfig";
import type { Role } from "@/types";
import { cx } from "@/lib/cx";

const ROLE_ROUTES: Record<Role, string> = {
  resident: "/resident",
  operator: "/operator",
  developer: "/developer",
  visitor: "/",
};

export function Topbar({ onMenuClick, title }: { onMenuClick: () => void; title?: string }) {
  const { theme, toggleTheme, role, setRole, notifications } = useStore();
  const [roleOpen, setRoleOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const unread = notifications.filter((n) => !n.read).length;
  const notifTarget = role === "resident" ? "/resident/notifications" : role === "operator" ? "/operator/alerts" : "/developer/notifications";
  const home = ROLE_ROUTES[role];
  const showBack = location.pathname !== home;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur md:px-6">
      <button
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-secondary hover:bg-surface-raised md:hidden"
      >
        <Menu size={18} />
      </button>

      {showBack ? <BackButton to={home} /> : null}

      <h1 className="truncate text-base font-semibold text-primary md:text-lg">{title}</h1>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-surface-raised hover:text-primary"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
        </button>

        {role !== "visitor" && (
          <button
            onClick={() => navigate(notifTarget)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-surface-raised hover:text-primary"
            aria-label="Notifications"
          >
            <Bell size={17} />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-danger">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75" />
              </span>
            )}
          </button>
        )}

        <div className="relative">
          <button
            onClick={() => setRoleOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-border py-1.5 pl-1.5 pr-2.5 text-sm hover:bg-surface-raised"
          >
            <Avatar name={role === "resident" ? "Alex Perera" : role === "operator" ? "Ops Team" : "JK Developer"} size="sm" />
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-xs font-semibold text-primary">{ROLE_LABEL[role]}</span>
              <span className="block text-[10px] text-tertiary">Account</span>
            </span>
            <ChevronDown size={14} className="text-tertiary" />
          </button>

          {roleOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setRoleOpen(false)} />
              <div className="absolute right-0 top-12 z-20 w-56 overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
                <p className="border-b border-border px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-tertiary">
                  View as
                </p>
                {(["resident", "operator", "developer"] as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setRoleOpen(false);
                      navigate(ROLE_ROUTES[r]);
                    }}
                    className={cx(
                      "flex w-full items-center justify-between px-3 py-2.5 text-left text-sm hover:bg-surface-raised",
                      role === r ? "text-brand-700 dark:text-brand-500 font-semibold" : "text-secondary",
                    )}
                  >
                    {ROLE_LABEL[r]}
                    {role === r && <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />}
                  </button>
                ))}
                <div className="border-t border-border">
                  <button
                    onClick={() => {
                      setRoleOpen(false);
                      navigate("/");
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-tertiary hover:bg-surface-raised hover:text-primary"
                  >
                    <LogOut size={14} /> Back to landing
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
