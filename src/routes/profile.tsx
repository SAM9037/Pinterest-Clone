import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { PinCard } from "@/components/PinCard";
import { useEffect, useState } from "react";
import { api, session, type Pin } from "@/lib/pinterest-api";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Pinfy" }, { name: "description", content: "Your profile and pins" }] }),
  component: Profile,
});

function Profile() {
  const nav = useNavigate();
  const [user, setUser] = useState(session.get());
  const [pins, setPins] = useState<Pin[]>([]);

  useEffect(() => {
    const u = session.get(); if (!u) { nav({ to: "/login" }); return; }
    setUser(u); api.myPins(u.userId).then(setPins);
  }, [nav]);

  const remove = async (id: number) => {
    await api.deletePin(id);
    if (user) api.myPins(user.userId).then(setPins);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-[1600px] mx-auto px-4 py-10">
        <section className="text-center max-w-xl mx-auto mb-10">
          <div className="w-28 h-28 mx-auto rounded-full bg-primary text-primary-foreground grid place-items-center text-4xl font-bold uppercase">
            {user.username[0]}
          </div>
          <h1 className="text-4xl mt-4">{user.username}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          {user.bio && <p className="mt-2">{user.bio}</p>}
          <div className="flex justify-center gap-6 text-sm mt-4 text-muted-foreground">
            <span><b className="text-foreground">{pins.length}</b> pins</span>
            <span><b className="text-foreground">0</b> followers</span>
            <span><b className="text-foreground">0</b> following</span>
          </div>
        </section>
        <h2 className="text-2xl mb-4">Your pins</h2>
        {pins.length === 0 ? (
          <p className="text-muted-foreground">No pins yet. Create your first one!</p>
        ) : (
          <div className="masonry">
            {pins.map(p => <PinCard key={p.pinId} pin={p} onDelete={remove} />)}
          </div>
        )}
      </main>
    </div>
  );
}
