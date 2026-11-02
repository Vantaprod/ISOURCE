import { getPendingSettlements, approveSettlement, rejectSettlement, processSettlement } from "@/app/actions/admin-finance";
import { formatNairaShort } from "@/lib/format";
import { CheckCircle2, XCircle, PlayCircle, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSettlementsPage() {
  const settlements = await getPendingSettlements();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Settlement Management</h1>
        <p className="text-sm text-muted">Approve and process vendor withdrawal requests.</p>
      </div>

      {settlements.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center">
          <ShieldCheck size={48} className="mx-auto text-muted mb-4" />
          <h2 className="text-lg font-bold text-charcoal mb-2">No pending settlements</h2>
          <p className="text-sm text-muted">All vendor payouts are up to date.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {settlements.map((s) => (
            <div key={s.id} className="rounded-xl border border-border bg-white p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 min-w-[250px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    s.status === "REQUESTED" ? "bg-orange-100 text-orange-700" :
                    s.status === "APPROVED" ? "bg-blue-100 text-blue-700" :
                    "bg-purple-100 text-purple-700"
                  }`}>{s.status}</span>
                  <span className="text-xs text-muted">{new Date(s.createdAt).toLocaleString()}</span>
                </div>
                <p className="font-bold text-charcoal text-lg">{formatNairaShort(Number(s.amountKobo))}</p>
                <p className="text-sm text-muted">
                  Ref: <span className="font-mono text-charcoal">{s.reference}</span>
                </p>
                <p className="text-xs text-muted mt-1">
                  Bank: {s.financeAccount.bankAccount?.bankName || "N/A"} •&nbsp;
                  {s.financeAccount.bankAccount?.accountName || "No bank account"}
                </p>
              </div>

              <div className="flex gap-2">
                {s.status === "REQUESTED" && (
                  <>
                    <form action={async () => {
                      "use server";
                      await approveSettlement(s.id);
                    }}>
                      <button className="h-10 px-4 rounded-md bg-green-600 text-white text-sm font-bold hover:bg-green-700 flex items-center gap-2">
                        <CheckCircle2 size={16} /> Approve
                      </button>
                    </form>
                    <form action={async () => {
                      "use server";
                      await rejectSettlement(s.id);
                    }}>
                      <button className="h-10 px-4 rounded-md border border-red-500 text-red-500 text-sm font-bold hover:bg-red-50 flex items-center gap-2">
                        <XCircle size={16} /> Reject
                      </button>
                    </form>
                  </>
                )}

                {s.status === "APPROVED" && (
                  <form action={async () => {
                    "use server";
                    await processSettlement(s.id);
                  }}>
                    <button className="h-10 px-4 rounded-md bg-primary text-white text-sm font-bold hover:bg-primary-hover flex items-center gap-2">
                      <PlayCircle size={16} /> Process Payout
                    </button>
                  </form>
                )}

                {s.status === "PROCESSING" && (
                  <span className="text-sm font-bold text-blue-600">Processing with Paystack...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}