"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
const STORAGE_KEY = "isource.cart.v2"; // Bumped version for bundles
export interface CartLine { productId?: string; bundleId?: string; variantId?: string; qty: number; }
interface CartState { lines: CartLine[]; ready: boolean; }
interface CartApi extends CartState { itemCount: number; add: (productId: string, qty?: number, variantId?: string) => void; addBundle: (bundleId: string, qty?: number) => void; remove: (id: string, variantId?: string) => void; setQty: (id: string, qty: number, variantId?: string) => void; clear: () => void; }
const CartContext = createContext<CartApi | null>(null);
function sameLine(a: CartLine, b: CartLine) { return a.productId === b.productId && a.bundleId === b.bundleId && a.variantId === b.variantId; }

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>({ lines: [], ready: false });
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as CartLine[]) : [];
      const safe = Array.isArray(parsed) ? parsed.filter((l) => (l.productId || l.bundleId) && typeof l.qty === "number" && l.qty > 0) : [];
      setState({ lines: safe, ready: true });
    } catch { setState({ lines: [], ready: true }); }
  }, []);
  useEffect(() => { if (state.ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines)); }, [state.lines, state.ready]);

  const add = useCallback((productId: string, qty = 1, variantId?: string) => {
    setState((prev) => {
      const idx = prev.lines.findIndex((l) => sameLine(l, { productId, variantId, qty }));
      if (idx >= 0) { const next = [...prev.lines]; next[idx] = { ...next[idx], qty: next[idx].qty + qty }; return { ...prev, lines: next }; }
      return { ...prev, lines: [...prev.lines, { productId, variantId, qty }] };
    });
  }, []);

  const addBundle = useCallback((bundleId: string, qty = 1) => {
    setState((prev) => {
      const idx = prev.lines.findIndex((l) => sameLine(l, { bundleId, qty }));
      if (idx >= 0) { const next = [...prev.lines]; next[idx] = { ...next[idx], qty: next[idx].qty + qty }; return { ...prev, lines: next }; }
      return { ...prev, lines: [...prev.lines, { bundleId, qty }] };
    });
  }, []);

  const remove = useCallback((id: string, variantId?: string) => { setState((prev) => ({ ...prev, lines: prev.lines.filter((l) => !sameLine(l, { productId: id, variantId, qty: 0 }) && !sameLine(l, { bundleId: id, qty: 0 })) })); }, []);
  
  const setQty = useCallback((id: string, qty: number, variantId?: string) => {
    if (qty <= 0) return remove(id, variantId);
    setState((prev) => ({ ...prev, lines: prev.lines.map((l) => (sameLine(l, { productId: id, variantId, qty }) || sameLine(l, { bundleId: id, qty })) ? { ...l, qty } : l) }));
  }, [remove]);

  const clear = useCallback(() => setState((prev) => ({ ...prev, lines: [] })), []);
  const itemCount = useMemo(() => state.lines.reduce((s, l) => s + l.qty, 0), [state.lines]);
  return <CartContext.Provider value={{ ...state, itemCount, add, addBundle, remove, setQty, clear }}>{children}</CartContext.Provider>;
}
export function useCart() { const ctx = useContext(CartContext); if (!ctx) throw new Error("useCart must be used inside <CartProvider>"); return ctx; }