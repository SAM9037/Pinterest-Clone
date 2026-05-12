// Pinterest backend client. Falls back to localStorage demo when API unreachable.
const BASE = "http://localhost:8080/pinterest";

async function call<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg = json?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return json as T;
}

export type User = {
  userId: number;
  username: string;
  email: string;
  mobileNumber?: string;
  profilePhoto?: string;
  bio?: string;
  status?: string;
};
export type Pin = {
  pinId?: number;
  userId: number;
  boardId?: number | null;
  title: string;
  description?: string;
  mediaUrl: string;
  sourceUrl?: string;
  keywords?: string;
  visibility?: string;
  status?: string;
};

type ApiResp<T> = { success: boolean; message: string; data: T };

// ---------- localStorage fallback ----------
const LS_USERS = "px_users";
const LS_PINS = "px_pins";
const LS_SESSION = "px_session";

function lsGet<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(k) || "") ?? fallback; } catch { return fallback; }
}
function lsSet(k: string, v: unknown) { if (typeof window !== "undefined") localStorage.setItem(k, JSON.stringify(v)); }

function seed() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(LS_PINS)) {
    const seedPins: Pin[] = [
      { pinId: 1, userId: 1, title: "Sunset over mountains", description: "Golden hour magic", mediaUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600", keywords: "nature,sunset", visibility: "PUBLIC", status: "PUBLISHED" },
      { pinId: 2, userId: 2, title: "Modern interior", description: "Clean Scandinavian design", mediaUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600", keywords: "interior,design", visibility: "PUBLIC", status: "PUBLISHED" },
      { pinId: 3, userId: 1, title: "Pasta plate", description: "Homemade carbonara", mediaUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600", keywords: "food,recipe", visibility: "PUBLIC", status: "PUBLISHED" },
      { pinId: 4, userId: 3, title: "Vintage bicycle", description: "City rides", mediaUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600", keywords: "travel,bike", visibility: "PUBLIC", status: "PUBLISHED" },
      { pinId: 5, userId: 2, title: "Coffee art", description: "Latte love", mediaUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600", keywords: "coffee,morning", visibility: "PUBLIC", status: "PUBLISHED" },
      { pinId: 6, userId: 1, title: "Workspace setup", description: "Minimal desk", mediaUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600", keywords: "desk,tech", visibility: "PUBLIC", status: "PUBLISHED" },
      { pinId: 7, userId: 3, title: "Forest path", description: "Quiet trail", mediaUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600", keywords: "nature,forest", visibility: "PUBLIC", status: "PUBLISHED" },
      { pinId: 8, userId: 2, title: "Fashion editorial", description: "Autumn looks", mediaUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600", keywords: "fashion", visibility: "PUBLIC", status: "PUBLISHED" },
    ];
    lsSet(LS_PINS, seedPins);
  }
  if (!localStorage.getItem(LS_USERS)) {
    lsSet(LS_USERS, [
      { userId: 1, username: "swethaa", email: "swethaa@gmail.com", password: "Swetha@123", mobileNumber: "9876543210", bio: "Java Full Stack Developer" },
      { userId: 2, username: "srin", email: "srin@gmail.com", password: "Srin@1234", mobileNumber: "9889543210", bio: "Frontend Developer" },
    ]);
  }
}
seed();

async function withFallback<T>(remote: () => Promise<T>, local: () => T): Promise<T> {
  try { return await remote(); } catch { return local(); }
}

// ---------- public API ----------
export const api = {
  async register(dto: User & { password: string }): Promise<User> {
    return withFallback(
      async () => (await call<ApiResp<User>>("/api/users/register", { method: "POST", body: JSON.stringify(dto) })).data,
      () => {
        const users = lsGet<(User & { password: string })[]>(LS_USERS, []);
        if (users.some(u => u.email === dto.email)) throw new Error("Email already in use");
        if (users.some(u => u.username === dto.username)) throw new Error("Username already taken");
        const u = { ...dto, userId: Date.now() };
        lsSet(LS_USERS, [...users, u]);
        return u;
      }
    );
  },
  async login(email: string, password: string): Promise<User> {
    return withFallback(
      async () => (await call<ApiResp<User>>("/api/users/login", { method: "POST", body: JSON.stringify({ email, password }) })).data,
      () => {
        const users = lsGet<(User & { password: string })[]>(LS_USERS, []);
        const u = users.find(x => x.email === email && x.password === password);
        if (!u) throw new Error("Invalid email or password");
        return u;
      }
    );
  },
  async resetPassword(email: string, mobileNumber: string, newPassword: string): Promise<string> {
    return withFallback(
      async () => (await call<ApiResp<string>>("/api/users/reset-password", { method: "POST", body: JSON.stringify({ email, mobileNumber, newPassword }) })).message,
      () => {
        const users = lsGet<(User & { password: string })[]>(LS_USERS, []);
        const idx = users.findIndex(u => u.email === email && u.mobileNumber === mobileNumber);
        if (idx < 0) throw new Error("Email and mobile do not match any user");
        users[idx].password = newPassword;
        lsSet(LS_USERS, users);
        return "Password reset successful";
      }
    );
  },
  async listPins(): Promise<Pin[]> {
    return withFallback(
      () => call<Pin[]>("/api/pins"),
      () => lsGet<Pin[]>(LS_PINS, [])
    );
  },
  async myPins(userId: number): Promise<Pin[]> {
    return withFallback(
      () => call<Pin[]>(`/api/pins/user/${userId}`),
      () => lsGet<Pin[]>(LS_PINS, []).filter(p => p.userId === userId)
    );
  },
  async createPin(p: Pin): Promise<Pin> {
    return withFallback(
      () => call<Pin>("/api/pins", { method: "POST", body: JSON.stringify(p) }),
      () => {
        const pins = lsGet<Pin[]>(LS_PINS, []);
        const created = { ...p, pinId: Date.now() };
        lsSet(LS_PINS, [created, ...pins]);
        return created;
      }
    );
  },
  async deletePin(id: number): Promise<void> {
    await withFallback(
      async () => { await call(`/api/pins/${id}`, { method: "DELETE" }); return null; },
      () => { lsSet(LS_PINS, lsGet<Pin[]>(LS_PINS, []).filter(p => p.pinId !== id)); return null; }
    );
  },
  async search(q: string): Promise<Pin[]> {
    return withFallback(
      () => call<Pin[]>(`/api/pins/search?q=${encodeURIComponent(q)}`),
      () => lsGet<Pin[]>(LS_PINS, []).filter(p =>
        p.title.toLowerCase().includes(q.toLowerCase()) ||
        (p.keywords || "").toLowerCase().includes(q.toLowerCase())
      )
    );
  },
};

// session helpers
export const session = {
  get(): User | null { return lsGet<User | null>(LS_SESSION, null); },
  set(u: User) { lsSet(LS_SESSION, u); },
  clear() { if (typeof window !== "undefined") localStorage.removeItem(LS_SESSION); },
};
