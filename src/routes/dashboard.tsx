import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { PinCard } from "@/components/PinCard";
import { useEffect, useState } from "react";
import { api, session, type Pin } from "@/lib/pinterest-api";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Home — Pinfy" }, { name: "description", content: "Your Pinfy feed" }] }),
  component: Dashboard,
});

function Dashboard() {
  const nav = useNavigate();
  const [pins, setPins] = useState<Pin[]>([]);
  const [filtered, setFiltered] = useState<Pin[]>([]);

  useEffect(() => {
    if (!session.get()) { nav({ to: "/login" }); return; }
    api.listPins().then(p => { setPins(p); setFiltered(p); });
  }, [nav]);

  const onSearch = (q: string) => {
    if (!q) return setFiltered(pins);
    const t = q.toLowerCase();
    setFiltered(pins.filter(p => p.title.toLowerCase().includes(t) || (p.keywords||"").toLowerCase().includes(t)));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={onSearch} />
      <main className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="masonry">
          {filtered.map(p => <PinCard key={p.pinId} pin={p} />)}
        </div>
      </main>
    </div>
  );
}
