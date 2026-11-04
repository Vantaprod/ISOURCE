"use client";

import { useState } from "react";
import { PackageSearch, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Simulate an API call
    setTimeout(() => {
      setLoading(false);
      if (orderId.length < 5) {
        setError("Please enter a valid order number.");
      }
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <div className="text-center mb-8">
        <PackageSearch size={48} className="mx-auto text-primary mb-4" />
        <h1 className="text-2xl font-extrabold text-charcoal">Track Your Order</h1>
        <p className="text-sm text-muted mt-2">Enter your order number to see delivery status.</p>
      </div>

      <form onSubmit={handleTrack} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-charcoal mb-1">Order Number</label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. ORD-12345"
            className="h-10 w-full rounded border border-border px-3 text-sm bg-white outline-none focus:border-primary"
            required
          />
        </div>

        {error && (
          <div className="rounded border border-danger/30 bg-danger/10 p-3 text-sm text-danger flex items-center gap-2">
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded bg-primary text-white font-bold text-sm hover:bg-primary-hover disabled:opacity-50"
        >
          {loading ? "Searching..." : "Track Order"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <Link href="/account/orders" className="text-sm text-primary font-bold hover:underline">
          View all your orders →
        </Link>
      </div>
    </div>
  );
}