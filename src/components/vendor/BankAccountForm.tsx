"use client";
import { useState, useEffect } from "react";
import { verifyAndSaveBankAccount, fetchBankList } from "@/app/actions/vendor-bank";
import { ShieldCheck, Loader2 } from "lucide-react";

export function BankAccountForm({ existing }: { existing: any }) {
  const [banks, setBanks] = useState<{ code: string; name: string }[]>([]);
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchBankList().then(setBanks).catch(console.error);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bankCode || accountNumber.length !== 10) {
      setMessage({ type: "error", text: "Please select a bank and enter a valid 10-digit account number." });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const result = await verifyAndSaveBankAccount(bankCode, accountNumber);
      if (result.success) {
        setMessage({ type: "success", text: `Verified! ${result.accountName} (${result.bankName} — ***${result.last4})` });
        setAccountNumber("");
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Verification failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {existing && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-xs font-bold text-green-800 uppercase mb-1">Current Verified Account</p>
          <p className="font-bold text-charcoal">{existing.accountName}</p>
          <p className="text-sm text-muted">{existing.bankName} • ***{existing.accountLast4}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-white p-6">
        <h3 className="font-bold text-charcoal mb-2">Add New Bank Account</h3>

        <div>
          <label className="block text-xs font-bold text-charcoal mb-1">Bank *</label>
          <select value={bankCode} onChange={(e) => setBankCode(e.target.value)} required className="w-full h-10 rounded border border-border px-3 text-sm bg-white">
            <option value="">Select a bank</option>
            {banks.map((b) => (
              <option key={b.code} value={b.code}>{b.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-charcoal mb-1">Account Number (10 digits) *</label>
          <input
            type="text" value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="0123456789" maxLength={10} required
            className="w-full h-10 rounded border border-border px-3 text-sm font-mono"
          />
        </div>

        {message && (
          <div className={`p-3 rounded text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full h-11 bg-primary text-white font-bold rounded-md hover:bg-primary-hover disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
          {loading ? "Verifying with Paystack..." : "Verify & Save Account"}
        </button>
      </form>
    </div>
  );
}