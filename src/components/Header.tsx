import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Plus, LogOut, User as UserIcon } from "lucide-react";
import { session } from "@/lib/pinterest-api";

export function Header({ onSearch }: { onSearch?: (q: string) => void }) {
  const [user, setUser] = useState(() => session.get());
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const route = useRouterState({ select: s => s.location.pathname });

  useEffect(() => { setUser(session.get()); }, [route]);

  const logout = () => { session.clear(); setUser(null); nav({ to: "/" }); };

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border">
      <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold text-lg">P</div>
          <span className="font-display text-xl text-primary hidden sm:inline">Pinfy</span>
        </Link>

        {user && (
          <nav className="flex items-center gap-1">
            <Link to="/dashboard" className="px-4 py-2 rounded-full text-sm font-semibold hover:bg-secondary [&.active]:bg-foreground [&.active]:text-background" activeProps={{ className: "active" }}>Home</Link>
            <Link to="/create" className="px-4 py-2 rounded-full text-sm font-semibold hover:bg-secondary [&.active]:bg-foreground [&.active]:text-background" activeProps={{ className: "active" }}>Create</Link>
          </nav>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); onSearch?.(q); }}
          className="flex-1 max-w-2xl mx-2"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); onSearch?.(e.target.value); }}
              placeholder="Search for ideas"
              className="w-full bg-secondary rounded-full pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </form>

        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <Link to="/profile" title="Profile" className="w-10 h-10 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold uppercase">
                {user.username[0]}
              </Link>
              <button onClick={logout} title="Log out" className="p-2 rounded-full hover:bg-secondary">
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-full text-sm font-semibold hover:bg-secondary">Log in</Link>
              <Link to="/register" className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
