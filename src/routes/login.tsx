import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { api, session } from "@/lib/pinterest-api";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — Pinfy" }, { name: "description", content: "Log in to Pinfy" }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [fails, setFails] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  // ticking timer for circuit-breaker visual
  useState(() => { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); });

  const locked = lockUntil && now < lockUntil;
  const remaining = lockUntil ? Math.max(0, Math.ceil((lockUntil - now) / 1000)) : 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    if (locked) { setErr(`Too many attempts. Wait ${remaining}s.`); return; }
    setLoading(true);
    try {
      const u = await api.login(email, password);
      session.set(u);
      nav({ to: "/dashboard" });
    } catch (ex: any) {
      const next = fails + 1;
      setFails(next);
      if (next >= 3) { setLockUntil(Date.now() + 60_000); setFails(0); setErr("3 failed attempts. Circuit OPEN for 60s."); }
      else setErr(ex.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-cream px-4">
      <div className="bg-card rounded-3xl shadow-xl p-10 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-primary text-primary-foreground grid place-items-center font-bold text-xl">P</div>
          <h1 className="text-3xl mt-3">Welcome to Pinfy</h1>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full px-4 py-3 rounded-full border border-border bg-background outline-none focus:ring-2 focus:ring-primary/40"
            type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="w-full px-4 py-3 rounded-full border border-border bg-background outline-none focus:ring-2 focus:ring-primary/40"
            type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <Link to="/forgot" className="block text-sm text-primary font-semibold underline-offset-2 hover:underline">Forgot your password?</Link>
          {err && <p className="text-sm text-destructive font-medium">{err}</p>}
          {locked && <p className="text-sm text-amber-600 font-semibold">Circuit OPEN — retry in {remaining}s</p>}
          <button disabled={loading || !!locked} className="w-full py-3 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 disabled:opacity-50">
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>
        <p className="text-center text-sm mt-6 text-muted-foreground">
          Not on Pinfy yet? <Link to="/register" className="text-primary font-semibold">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
