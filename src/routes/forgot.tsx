import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "@/lib/pinterest-api";

export const Route = createFileRoute("/forgot")({
  head: () => ({ meta: [{ title: "Reset password — Pinfy" }, { name: "description", content: "Reset your Pinfy password" }] }),
  component: Forgot,
});

function Forgot() {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(""); setMsg("");
    try { setMsg(await api.resetPassword(email, mobile, pw)); }
    catch (ex: any) { setErr(ex.message || "Reset failed"); }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-cream px-4">
      <div className="bg-card rounded-3xl shadow-xl p-10 w-full max-w-md">
        <h1 className="text-3xl text-center">Reset password</h1>
        <p className="text-center text-sm text-muted-foreground mt-1">Verify with your registered mobile number</p>
        <form onSubmit={submit} className="space-y-3 mt-6">
          <input className="w-full px-4 py-3 rounded-full border border-border bg-background" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="w-full px-4 py-3 rounded-full border border-border bg-background" placeholder="Mobile number" value={mobile} onChange={e=>setMobile(e.target.value)} required />
          <input className="w-full px-4 py-3 rounded-full border border-border bg-background" type="password" placeholder="New password" value={pw} onChange={e=>setPw(e.target.value)} required />
          {msg && <p className="text-sm text-green-600 font-semibold">{msg}</p>}
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button className="w-full py-3 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90">Reset password</button>
        </form>
        <p className="text-center text-sm mt-6 text-muted-foreground">
          Remembered it? <Link to="/login" className="text-primary font-semibold">Log in</Link>
        </p>
      </div>
    </div>
  );
}
