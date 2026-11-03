export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { RotateCcw, Package, AlertCircle } from "lucide-react";
import Link from "next/link";

export default async function ReturnsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Fetch refunds/returns for this user. 
  // Note: We include the order to show the order number.
  const refunds = await prisma.refund.findMany({
    where: { order: { userId: session.userId } },
    include: { order: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Returns & Refunds</h1>
          <p className="text-sm text-muted">Track the status of your returned items and refunds.</p>
        </div>
        <Link href="/account/orders" className="flex items-center gap-2 rounded-md border border-border bg-white px-4 py-2 text-sm font-bold text-charcoal hover:bg-surface">
          View Orders
        </Link>
      </div>

      {refunds.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center">
          <RotateCcw size={40} className="mx-auto text-muted mb-4" />
          <h2 className="text-lg font-bold text-charcoal mb-2">No returns or refunds</h2>
          <p className="text-sm text-muted mb-4">You haven&apos;t requested any returns yet. If you have an issue with an order, you can request a return from your order history.</p>
          <Link href="/account/orders" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-bold text-white hover:bg-primary-hover">
            Go to My Orders
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {refunds.map((refund) => (
            <div key={refund.id} className="rounded-xl border border-border bg-white p-5">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border pb-4 mb-4">
                <div>
                  <span className="text-xs font-bold text-muted uppercase tracking-wider">Order #{refund.order.orderNumber || refund.orderId.slice(-6)}</span>
                  <h3 className="font-bold text-charcoal text-lg mt-1">Refund Request</h3>
                  <p className="text-sm text-muted">Requested on {new Date(refund.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  {refund.status === "PENDING" && <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700"><AlertCircle size={12}/> Pending Approval</span>}
                  {refund.status === "APPROVED" && <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700"><RotateCcw size={12}/> Approved</span>}
                  {refund.status === "REJECTED" && <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700"><AlertCircle size={12}/> Rejected</span>}
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal mb-1">Reason for Return:</p>
                  <p className="text-sm text-muted">{refund.reason || "No reason provided."}</p>
                </div>
                <div className="md:w-48 bg-surface rounded-lg p-4 border border-border">
                  <p className="text-xs text-muted mb-1">Refund Amount</p>
                  <p className="text-lg font-extrabold text-charcoal">
                    ₦{(refund.amountKobo / 100).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
