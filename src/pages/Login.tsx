import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, LogIn } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/useStore";
import { NesturaLockup } from "@/components/brand/NesturaMark";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { DEMO_ACCOUNTS, DEMO_PASSWORD, type DemoAccount } from "@/data/demoAccounts";
import type { Role } from "@/types";

function resolveAccount(email: string, hint: string | null): DemoAccount | undefined {
  const direct = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
  if (direct) return direct;
  if (hint === "operator" || hint === "developer" || hint === "resident" || hint === "visitor") {
    return DEMO_ACCOUNTS.find((a) => a.role === hint);
  }
  return undefined;
}

export function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setRole, setResidentTier } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const hint = params.get("role");

  function enter(account: DemoAccount) {
    setRole(account.role);
    if (account.tier) setResidentTier(account.tier);
    navigate(account.to);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setNote(null);
    const account = resolveAccount(email, hint);

    if (supabase) {
      const timeout = new Promise<{ error: { message: string } | null; data: { user: { user_metadata?: Record<string, unknown> } | null } }>(
        (resolve) => setTimeout(() => resolve({ error: { message: "Sign-in timed out" }, data: { user: null } }), 4000),
      );
      const result = await Promise.race([
        supabase.auth.signInWithPassword({ email: email.trim(), password }),
        timeout,
      ]);
      if (!result.error && result.data.user) {
        const meta = result.data.user.user_metadata ?? {};
        const role = (meta.role as Role) || account?.role || "resident";
        const found =
          DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email.trim().toLowerCase()) ??
          DEMO_ACCOUNTS.find((a) => a.role === role && (!meta.tier || a.tier === meta.tier)) ??
          account;
        if (found) enter(found);
        else {
          setRole(role);
          navigate(role === "operator" ? "/operator" : role === "developer" ? "/developer" : role === "visitor" ? "/visitor/request" : "/resident");
        }
        setLoading(false);
        return;
      }
      if (result.error) setNote(result.error.message);
    }

    if (account && password === DEMO_PASSWORD) {
      enter(account);
      return;
    }

    setNote((prev) => prev ?? "Use a seeded account, or run supabase/seed-users.sql in the SQL editor.");
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg bg-noise p-6">
      <div className="w-full max-w-sm">
        <BackButton to="/" className="mb-6" />
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="rounded-2xl border border-border bg-surface p-7 shadow-soft">
          <div className="flex flex-col items-center text-center">
            <NesturaLockup height={46} />
            <p className="mt-4 text-lg font-bold text-primary">Sign in</p>
            <p className="mt-1 text-sm text-tertiary">One account for your role in the building.</p>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-secondary">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.owner@example.com"
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
                className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-primary focus:border-brand-400 focus:outline-none"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 size={15} className="animate-spin" /> : <LogIn size={15} />}
              Sign In
            </Button>
          </form>

          {note && <p className="mt-4 text-center text-[11px] leading-relaxed text-tertiary">{note}</p>}
          <p className="mt-5 text-center text-[11px] leading-relaxed text-tertiary">
            After seeding: john.owner@example.com, operator@example.com, developer@example.com · {DEMO_PASSWORD}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
