import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
import { api, session } from "@/lib/pinterest-api";
import { Upload } from "lucide-react";

export const Route = createFileRoute("/create")({
  head: () => ({ meta: [{ title: "Create Pin — Pinfy" }, { name: "description", content: "Create a new pin" }] }),
  component: Create,
});

function Create() {
  const nav = useNavigate();
  const [user, setUser] = useState(session.get());
  const [f, setF] = useState({ title: "", description: "", mediaUrl: "", sourceUrl: "", keywords: "", visibility: "PUBLIC", status: "PUBLISHED" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { const u = session.get(); if (!u) nav({ to: "/login" }); else setUser(u); }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    if (!user) return;
    if (!f.title.trim()) return setErr("Please provide a valid title");
    if (!f.mediaUrl.trim()) return setErr("Please provide a valid mediaUrl");
    setLoading(true);
    try {
      await api.createPin({ ...f, userId: user.userId });
      nav({ to: "/profile" });
    } catch (ex: any) { setErr(ex.message); }
    finally { setLoading(false); }
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const r = new FileReader();
    r.onload = () => setF(s => ({ ...s, mediaUrl: r.result as string }));
    r.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-5xl mx-auto p-6">
        <div className="bg-card rounded-3xl shadow-lg p-8 grid md:grid-cols-2 gap-8">
          <div>
            <label className="block aspect-[3/4] rounded-2xl border-2 border-dashed border-border bg-cream cursor-pointer overflow-hidden hover:bg-secondary transition-colors">
              {f.mediaUrl ? (
                <img src={f.mediaUrl} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="h-full grid place-items-center text-muted-foreground p-6 text-center">
                  <div>
                    <Upload className="w-10 h-10 mx-auto mb-3" />
                    <p className="font-semibold">Click to upload</p>
                    <p className="text-xs mt-1">or paste an image URL below</p>
                  </div>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={onFile} />
            </label>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <h1 className="text-3xl">Create Pin</h1>
            <input className="w-full px-4 py-3 rounded-full border border-border bg-background" placeholder="Add a title" value={f.title} onChange={e=>setF({...f, title:e.target.value})} required />
            <textarea className="w-full px-4 py-3 rounded-2xl border border-border bg-background min-h-[100px]" placeholder="Tell everyone what your Pin is about" value={f.description} onChange={e=>setF({...f, description:e.target.value})} />
            <input className="w-full px-4 py-3 rounded-full border border-border bg-background" placeholder="Image URL" value={f.mediaUrl} onChange={e=>setF({...f, mediaUrl:e.target.value})} />
            <input className="w-full px-4 py-3 rounded-full border border-border bg-background" placeholder="Source URL (optional)" value={f.sourceUrl} onChange={e=>setF({...f, sourceUrl:e.target.value})} />
            <input className="w-full px-4 py-3 rounded-full border border-border bg-background" placeholder="Keywords (comma separated)" value={f.keywords} onChange={e=>setF({...f, keywords:e.target.value})} />
            <select className="w-full px-4 py-3 rounded-full border border-border bg-background" value={f.visibility} onChange={e=>setF({...f, visibility:e.target.value})}>
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </select>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={()=>setF({...f, status:"DRAFT"})} className="px-5 py-3 rounded-full bg-secondary font-semibold">Save draft</button>
              <button disabled={loading} className="flex-1 px-5 py-3 rounded-full bg-primary text-primary-foreground font-bold disabled:opacity-50">
                {loading ? "Publishing…" : "Publish"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
