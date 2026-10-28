"use client";
import { useState } from "react";
export function Newsletter() {
  const [email, setEmail] = useState(""); const [status, setStatus] = useState<"idle" | "invalid" | "ok">("idle");
  function onSubmit(e: React.FormEvent) { e.preventDefault(); const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()); if (!valid) { setStatus("invalid"); return; } setStatus("ok"); setEmail(""); }
  return (
    <section className="bg-surface border-t border-border"><div className="mx-auto max-w-[1440px] px-4 py-6 md:py-8">
      <div className="grid md:grid-cols-[1fr_minmax(320px,520px)] gap-4 items-center">
        <div><h3 className="text-base md:text-lg font-bold text-charcoal">Get the best deals, latest products and more</h3><p className="text-sm text-muted mt-1">Subscribe to our newsletter.</p></div>
        <form onSubmit={onSubmit} noValidate className="flex gap-2"><input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }} placeholder="Enter your email address" aria-label="Email address" className="flex-1 h-11 rounded-md border border-border bg-white px-3 text-sm outline-none focus:border-primary" /><button type="submit" className="h-11 px-5 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover">Subscribe</button></form>
      </div>
      {status === "invalid" && (<p className="mt-2 text-xs text-danger md:text-right">Please enter a valid email address.</p>)}
      {status === "ok" && (<p className="mt-2 text-xs text-success md:text-right">Thanks — newsletter subscription is not yet live in this demo.</p>)}
    </div></section>
  );
}