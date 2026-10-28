"use client";
import { useEffect, useState } from "react";
export function Countdown({ initialSeconds = 2 * 3600 + 14 * 60 + 36 }: { initialSeconds?: number }) {
  const [remaining, setRemaining] = useState(initialSeconds);
  useEffect(() => { const id = setInterval(() => setRemaining((r) => (r > 0 ? r - 1 : 0)), 1000); return () => clearInterval(id); }, []);
  const h = String(Math.floor(remaining / 3600)).padStart(2, "0"); const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0"); const s = String(remaining % 60).padStart(2, "0");
  return (
    <span className="inline-flex items-center gap-1 text-xs md:text-sm">
      <span className="text-charcoal font-medium mr-1">Ends in</span>
      <span className="bg-charcoal text-white px-1.5 py-0.5 rounded font-mono font-semibold tabular-nums">{h}</span><span className="text-charcoal font-bold">:</span>
      <span className="bg-charcoal text-white px-1.5 py-0.5 rounded font-mono font-semibold tabular-nums">{m}</span><span className="text-charcoal font-bold">:</span>
      <span className="bg-charcoal text-white px-1.5 py-0.5 rounded font-mono font-semibold tabular-nums">{s}</span>
    </span>
  );
}