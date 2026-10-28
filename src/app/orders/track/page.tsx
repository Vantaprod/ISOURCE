"use client";
import { useState } from "react";
import { PackageSearch, AlertTriangle } from "lucide-react";

export default function TrackOrderPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 md:py-20">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
            <PackageSearch size={32} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Track Your Order</h1>
          <p className="text-sm text-muted">Enter your order number and email to see the status.</p>
        </div>

        {submitted ? (
          <div className="rounded-lg border border-warning/30 bg-warning/10 p-6 text-center">
            <AlertTriangle size={32} className="text-warning mx-auto mb-3" />
            <h2 className="font-bold text-charcoal mb-1">Order tracking requires a database</h2>
            <p className="text-sm text-charcoal/80 mb-4">In this demo, orders are stored locally in your browser and cannot be queried from another device.</p>
            <button onClick={() => setSubmitted(false)} className="text-primary font-medium hover:underline text-sm">Try again</button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="rounded-lg border border-border bg-white p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1">Order Number</label>
              <input required type="text" placeholder="e.g. IS-12345678" className="h-11 w-full rounded border border-border px-3 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Email or Phone</label>
              <input required type="text" placeholder="The email or phone used at checkout" className="h-11 w-full rounded border border-border px-3 text-sm outline-none focus:border-primary" />
            </div>
            <button type="submit" className="w-full h-11 rounded bg-primary text-white text-sm font-semibold hover:bg-primary-hover">
              Track Order
            </button>
          </form>
        )}
      </div>
    </div>
  );
}