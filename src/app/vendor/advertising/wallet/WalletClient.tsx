"use client";

import { useState, useTransition } from "react";
import { initializeFunding } from "@/app/actions/advertising-wallet";

const PRESETS = [5000, 10000, 25000, 50000, 100000];

export function WalletClient() {
  const [amount, setAmount] = useState<number>(10000);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFund() {
    setError(null);
    const naira = custom ? Number(custom) : amount;
    if (!Number.isFinite(naira) || naira < 500) {
      setError("Minimum ₦500");
      return;
    }
    startTransition(async () => {
      const result = await initializeFunding(naira);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      window.location.href = result.authorizationUrl;
    });
  }

  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <h3 className="text-sm font-bold text-charcoal mb-3">Fund your advertising wallet</h3>

      <div className="flex flex-wrap gap-2 mb-3">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => { setAmount(p); setCustom(""); }}
            className={`px-3 py-1.5 rounded-md border text-sm font-semibold transition-colors ${
              !custom && amount === p
                ? "border-primary bg-primary text-white"
                : "border-border text-charcoal hover:border-primary"
            }`}
          >
            ₦{p.toLocaleString()}
          </button>
        ))}
      </div>

      <div className="flex gap-2 items-stretch mb-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₦</span>
          <input
            type="number"
            min={500}
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Custom amount"
            className="h-10 w-full rounded border border-border pl-7 pr-3 text-sm bg-white outline-none focus:border-primary"
          />
        </div>
        <button
          type="button"
          onClick={handleFund}
          disabled={isPending}
          className="h-10 px-6 rounded bg-primary text-white text-sm font-bold hover:bg-primary-hover disabled:opacity-50 transition-colors"
        >
          {isPending ? "Redirecting..." : "Fund with Paystack"}
        </button>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}
      <p className="text-xs text-muted mt-2">
        Paystack secure checkout. Wallet credits within seconds of successful payment.
      </p>
    </div>
  );
}