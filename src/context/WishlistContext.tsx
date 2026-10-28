"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
const STORAGE_KEY = "isource.wishlist.v1";
interface WishlistState { ids: string[]; ready: boolean; }
interface WishlistApi extends WishlistState { count: number; has: (id: string) => boolean; toggle: (id: string) => void; remove: (id: string) => void; clear: () => void; }
const WishlistContext = createContext<WishlistApi | null>(null);
export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WishlistState>({ ids: [], ready: false });
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      const safe = Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
      setState({ ids: safe, ready: true });
    } catch { setState({ ids: [], ready: true }); }
  }, []);
  useEffect(() => { if (state.ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids)); }, [state.ids, state.ready]);

  const toggle = useCallback((id: string) => {
    setState((prev) => prev.ids.includes(id) ? { ...prev, ids: prev.ids.filter((x) => x !== id) } : { ...prev, ids: [...prev.ids, id] });
  }, []);
  const remove = useCallback((id: string) => setState((prev) => ({ ...prev, ids: prev.ids.filter((x) => x !== id) })), []);
  const clear = useCallback(() => setState((prev) => ({ ...prev, ids: [] })), []);
  const has = useCallback((id: string) => state.ids.includes(id), [state.ids]);
  const count = useMemo(() => state.ids.length, [state.ids]);
  return <WishlistContext.Provider value={{ ...state, count, has, toggle, remove, clear }}>{children}</WishlistContext.Provider>;
}
export function useWishlist() { const ctx = useContext(WishlistContext); if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>"); return ctx; }