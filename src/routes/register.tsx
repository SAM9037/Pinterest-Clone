import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { api, session } from "@/lib/pinterest-api";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Sign up — Pinfy" }, { name: "description", content: "Create your Pinfy account" }] }),
  component: Register,
});

const emailRe = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|org|in)$/;
const userRe = /^[a-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+$/;
const pwRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,16}$/;

function Register() {
  const nav = useNavigate();
  const [f, setF] = useState({ username: "", email: "", password: "", confirm: "", mobileNumber: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (f.email && !emailRe.test(f.email)) e.email = "Email must be valid (.com/.org/.in)";
    if (f.username && !userRe.test(f.username)) e.username = "Lowercase letters, digits and special characters only";
    if (f.password && !pwRe.test(f.password)) e.password = "8-16 chars, upper+lower+digit+special";
    if (f.confirm && f.password !== f.confirm) e.confirm = "Passwords do not match";
    return e;
  }, [f]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    if (Object.keys(errors).length) return;
    setLoading(true);
    try {
      const u = await api.register({ ...f, userId: 0 } as any);
      session.set(u);
      nav({ to: "/dashboard" });
    } catch (ex: any) { setErr(ex.message || "Registration failed"); }
    finally { setLoading(false); }
  };

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  return (
    <div className="min-h-screen grid place-items-center bg-cream px-4 py-10">
      <div className="bg-card rounded-3xl shadow-xl p-10 w-full max-w-md">
        <h1 className="text-3xl text-center">Create account</h1>
        <p className="text-center text-sm text-muted-foreground mt-1">Find new ideas to try</p>
        <form onSubmit={submit} className="space-y-3 mt-6">
          <div>
            <input className="w-full px-4 py-3 rounded-full border border-border bg-background outline-none" placeholder="Username" value={f.username} onChange={set("username")} required />
            {errors.username && <p className="text-xs text-destructive mt-1 ml-3">{errors.username}</p>}
          </div>
          <div>
            <input className="w-full px-4 py-3 rounded-full border border-border bg-background outline-none" type="email" placeholder="Email" value={f.email} onChange={set("email")} required />
            {errors.email && <p className="text-xs text-destructive mt-1 ml-3">{errors.email}</p>}
          </div>
          <input className="w-full px-4 py-3 rounded-full border border-border bg-background outline-none" placeholder="Mobile number" value={f.mobileNumber} onChange={set("mobileNumber")} />
          <div>
            <input className="w-full px-4 py-3 rounded-full border border-border bg-background outline-none" type="password" placeholder="Password" value={f.password} onChange={set("password")} required />
            {errors.password && <p className="text-xs text-destructive mt-1 ml-3">{errors.password}</p>}
          </div>
          <div>
            <input className="w-full px-4 py-3 rounded-full border border-border bg-background outline-none" type="password" placeholder="Confirm password" value={f.confirm} onChange={set("confirm")} required />
            {errors.confirm && <p className="text-xs text-destructive mt-1 ml-3">{errors.confirm}</p>}
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button disabled={loading} className="w-full py-3 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 disabled:opacity-50">
            {loading ? "Creating…" : "Continue"}
          </button>
        </form>
        <p className="text-center text-sm mt-6 text-muted-foreground">
          Already a member? <Link to="/login" className="text-primary font-semibold">Log in</Link>
        </p>
      </div>
    </div>
  );
}
