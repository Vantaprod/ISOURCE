import { getWalletSummary, getWalletTransactions } from "@/app/actions/advertising-wallet";
import { WalletClient } from "./WalletClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

function formatNaira(koboStr: string): string {
  const kobo = BigInt(koboStr);
  const naira = kobo / BigInt(100);
  return "₦" + naira.toLocaleString();
}

const TYPE_LABEL: Record<string, string> = {
  FUNDING: "Funded",
  CLICK_CHARGE: "Click charge",
  IMPRESSION_CHARGE: "Impression charge",
  REFUND: "Refund",
  HOLD: "Hold",
  RELEASE: "Release",
};

export default async function WalletPage() {
  const [summary, txs] = await Promise.all([getWalletSummary(), getWalletTransactions(50)]);
  const isEmpty = summary.availableKobo === "0" && txs.length === 0;

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-muted font-semibold">Available Balance</p>
          <p className="text-3xl font-extrabold text-primary mt-1">{formatNaira(summary.availableKobo)}</p>
          <p className="text-xs text-muted mt-2">Ready to spend on campaigns</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-muted font-semibold">Reserved</p>
          <p className="text-3xl font-extrabold text-charcoal mt-1">{formatNaira(summary.reservedKobo)}</p>
          <p className="text-xs text-muted mt-2">Held for active campaigns</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-muted font-semibold">Lifetime Spent</p>
          <p className="text-3xl font-extrabold text-charcoal mt-1">{formatNaira(summary.lifetimeSpentKobo)}</p>
          <p className="text-xs text-muted mt-2">Total advertising spend</p>
        </div>
      </div>

      {/* Empty state OR fund form */}
      {isEmpty ? (
        <div className="rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 p-8 text-center">
          <p className="text-lg font-bold text-charcoal">Your advertising wallet is empty</p>
          <p className="text-sm text-muted mt-1 mb-5">Fund ₦5,000 or more to start running Sponsored Products campaigns.</p>
          <WalletClient />
        </div>
      ) : (
        <WalletClient />
      )}

      {/* Transactions */}
      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="text-sm font-bold text-charcoal">Transaction History</h3>
            <p className="text-xs text-muted mt-0.5">Latest 50 entries</p>
          </div>
          <Link
            href="/vendor/advertising/wallet/statement.csv"
            className="h-9 px-4 rounded border border-charcoal text-charcoal text-xs font-bold flex items-center hover:bg-charcoal hover:text-white transition-colors"
          >
            Download CSV
          </Link>
        </div>

        {txs.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted">No transactions yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface text-xs uppercase text-muted">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Date</th>
                  <th className="text-left px-5 py-3 font-semibold">Type</th>
                  <th className="text-right px-5 py-3 font-semibold">Amount</th>
                  <th className="text-right px-5 py-3 font-semibold">Balance After</th>
                  <th className="text-left px-5 py-3 font-semibold">Reference</th>
                </tr>
              </thead>
              <tbody>
                {txs.map((t) => {
                  const amt = BigInt(t.amountKobo);
                  const isCredit = amt > 0;
                  return (
                    <tr key={t.id} className="border-t border-border">
                      <td className="px-5 py-3 text-charcoal whitespace-nowrap">
                        {new Date(t.createdAt).toLocaleDateString("en-NG", { dateStyle: "medium" })}
                      </td>
                      <td className="px-5 py-3 text-charcoal">{TYPE_LABEL[t.type] || t.type}</td>
                      <td className={`px-5 py-3 text-right font-bold ${isCredit ? "text-green-600" : "text-charcoal"}`}>
                        {isCredit ? "+" : ""}
                        {formatNaira(t.amountKobo)}
                      </td>
                      <td className="px-5 py-3 text-right text-charcoal">{formatNaira(t.balanceAfterKobo)}</td>
                      <td className="px-5 py-3 text-xs text-muted font-mono truncate max-w-[200px]">{t.reference}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}