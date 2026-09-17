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
  const { setAccount } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const hint = params.get("role");

  function enter(account: DemoAccount) {
    setAccount(account);
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
          setAccount({
            key: "custom",
            name: (meta.name as string) || email,
            email,
            role,
            unitId: "W001",
            to: role === "operator" ? "/operator" : role === "developer" ? "/developer" : role === "visitor" ? "/visitor/request" : "/resident",
            label: role,
            detail: "",
          });
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

    setNote((prev) => prev ?? "Check your email and password and try again.");
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg bg-noise p-6">
      <div className="w-full max-w-lg">
        <BackButton to="/" className="mb-6" />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl border border-border bg-surface px-10 py-12 shadow-soft sm:px-12 sm:py-14"
        >
          <div className="flex flex-col items-center text-center">
            <NesturaLockup height={56} />
            <p className="mt-6 text-2xl font-bold text-primary">Sign in</p>
            <p className="mt-2 max-w-sm text-sm text-tertiary">One account for your role in the building.</p>
          </div>

          <form onSubmit={onSubmit} className="mt-10 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-secondary">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-xl border border-border bg-bg px-4 py-3.5 text-base text-primary placeholder:text-tertiary focus:border-brand-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-secondary">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-bg px-4 py-3.5 text-base text-primary focus:border-brand-400 focus:outline-none"
              />
            </div>
            <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
              Sign In
            </Button>
          </form>

          {note && <p className="mt-6 text-center text-sm leading-relaxed text-tertiary">{note}</p>}
        </motion.div>
      </div>
    </div>
  );
}
