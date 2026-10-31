"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, X } from "lucide-react";

type Toast = { id: string; message: string; type?: "success" | "error" };
type ToastContextType = { toast: (message: string, type?: "success" | "error") => void };

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto flex items-center gap-3 rounded-lg border border-border bg-white px-4 py-3 shadow-xl text-sm font-medium animate-in fade-in slide-in-from-bottom-5">
            {t.type === "success" && <CheckCircle2 size={18} className="text-success" />}
            <span className="text-charcoal">{t.message}</span>
            <button onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} className="ml-2 text-muted hover:text-charcoal">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}