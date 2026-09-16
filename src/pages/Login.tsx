import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, LogIn, Home, Wrench, LineChart } from "lucide-react";
import { supabase, supabaseEnabled } from "@/lib/supabase";
import { useStore } from "@/store/useStore";
import { NesturaMark } from "@/components/brand/NesturaMark";
import { Button } from "@/components/ui/Button";
import type { Role } from "@/types";

const DEMO_PASSWORD = "NesturaDemo!2026";

const DEMO_ACCOUNTS: { role: Role; email: string; to: string; label: string; icon: typeof Home }[] = [
  { role: "resident", email: "resident@nestura.demo", to: "/resident", label: "Resident", icon: Home },
  { role: "operator", email: "operator@nestura.demo", to: "/operator", label: "Building Operator", icon: Wrench },
  { role: "developer", email: "developer@nestura.demo", to: "/developer", label: "Developer", icon: LineChart },
];

export function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setRole } = useStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  function enterDemo(role: Role, to: string) {
    setRole(role);
    navigate(to);
  }

  async function signIn(email: string, password: string, role: Role, to: string, key: string) {
    setLoading(key);
    setNote(null);
    if (!supabase) {
      setNote("Supabase isn't configured in this environment — continuing in local demo mode.");
      enterDemo(role, to);
      setLoading(null);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(null);
    if (error) {
      setNote(`${error.message} — continuing in local demo mode so you can still explore.`);
      enterDemo(role, to);
      return;
    }
    enterDemo(role, to);
  }

  const preselect = params.get("role") as Role | null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg bg-noise p-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-7 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <NesturaMark size={44} />
          <p className="mt-3 text-lg font-bold text-primary">Sign in to Nestura</p>
          <p className="mt-1 text-sm text-tertiary">Your smart-living account, one login for every role.</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const match = DEMO_ACCOUNTS.find((a) => a.email === email) ?? DEMO_ACCOUNTS[0];
            signIn(email, password, match.role, match.to, "form");
          }}
          className="mt-6 space-y-3"
        >
          <div>
            <label className="mb-1.5 block text-xs font-medium text-secondary">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@nestura.demo"
              className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-primary placeholder:text-tertiary focus:border-brand-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-secondary">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-primary placeholder:text-tertiary focus:border-brand-400 focus:outline-none"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading === "form"}>
            {loading === "form" ? <Loader2 size={15} className="animate-spin" /> : <LogIn size={15} />}
            Sign In
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-wide text-tertiary">
          <div className="h-px flex-1 bg-border" /> or continue with a demo account <div className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-2">
          {DEMO_ACCOUNTS.map((a) => (
            <button
              key={a.role}
              onClick={() => signIn(a.email, DEMO_PASSWORD, a.role, a.to, a.role)}
              disabled={!!loading}
              className={`flex w-full items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors disabled:opacity-60 ${
                preselect === a.role ? "border-brand-400 bg-brand-50 dark:bg-brand-900/20" : "border-border hover:bg-surface-raised"
              }`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-raised text-secondary">
                {loading === a.role ? <Loader2 size={14} className="animate-spin" /> : <a.icon size={14} />}
              </span>
              <span>
                <span className="block font-medium text-primary">{a.label}</span>
                <span className="block text-[11px] text-tertiary">{a.email}</span>
              </span>
            </button>
          ))}
        </div>

        {note && <p className="mt-4 text-center text-[11px] leading-relaxed text-tertiary">{note}</p>}
        {!supabaseEnabled && (
          <p className="mt-4 text-center text-[11px] text-tertiary">Running without Supabase configured — all sign-ins use local demo mode.</p>
        )}
      </div>
    </div>
  );
}
