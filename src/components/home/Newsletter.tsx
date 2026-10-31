"use client";
import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState(""); const [status, setStatus] = useState<"idle" | "invalid" | "ok">("idle");
  function onSubmit(e: React.FormEvent) { e.preventDefault(); const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()); if (!valid) { setStatus("invalid"); return; } setStatus("ok"); setEmail(""); }
  
  return (
    <section className="bg-charcoal-deep text-white border-t border-white/10">
      <div className="mx-auto max-w-[1440px] px-4 py-8 md:py-10">
        <div className="grid md:grid-cols-[1fr_400px] gap-6 items-center">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Stay in the Loop</h3>
            <p className="text-sm text-white/60">Get the latest deals, new arrivals and exclusive offers.</p>
          </div>
          <form onSubmit={onSubmit} noValidate className="flex gap-2">
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }} placeholder="Enter your email address" aria-label="Email address" className="flex-1 h-11 rounded-md border border-white/20 bg-white/5 px-4 text-sm text-white outline-none focus:border-primary placeholder:text-white/40" />
            <button type="submit" className="h-11 px-6 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover">Subscribe</button>
          </form>
        </div>
        {status === "invalid" && (<p className="mt-2 text-xs text-danger text-right">Please enter a valid email address.</p>)}
        {status === "ok" && (<p className="mt-2 text-xs text-success text-right">Thanks for subscribing!</p>)}
      </div>
    </section>
  );
}