import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { PinCard } from "@/components/PinCard";
import { useEffect, useState } from "react";
import { api, type Pin } from "@/lib/pinterest-api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pinfy — Discover ideas, save what you love" },
      { name: "description", content: "Pinfy is a Pinterest-style visual discovery platform. Create pins, organize boards, and explore ideas." },
      { property: "og:title", content: "Pinfy — Discover ideas" },
      { property: "og:description", content: "Visual discovery platform for ideas, boards, and pins." },
    ],
  }),
  component: Index,
});

function Index() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [filtered, setFiltered] = useState<Pin[]>([]);

  useEffect(() => { api.listPins().then(p => { setPins(p); setFiltered(p); }); }, []);

  const onSearch = (q: string) => {
    if (!q) return setFiltered(pins);
    const t = q.toLowerCase();
    setFiltered(pins.filter(p => p.title.toLowerCase().includes(t) || (p.keywords||"").toLowerCase().includes(t)));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={onSearch} />
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-8 text-center">
        <h1 className="text-5xl md:text-7xl text-primary leading-tight">Get your next great idea</h1>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Discover recipes, home ideas, style inspiration and other ideas to try.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/register" className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90">Get started</Link>
          <Link to="/login" className="px-6 py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90">Log in</Link>
        </div>
      </section>

      <main className="max-w-[1600px] mx-auto px-4 pb-16">
        <div className="masonry">
          {filtered.map(p => <PinCard key={p.pinId} pin={p} />)}
        </div>
      </main>
    </div>
  );
}
