import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Clock, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SellPage() {
  const session = await getSession();

  if (session) {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: session.userId },
    });

    if (vendor) {
      if (vendor.status === "APPROVED") {
        // If approved, go straight to the dashboard
        redirect("/vendor");
      } else if (vendor.status === "PENDING") {
        // If pending, show a waiting screen
        return (
          <div className="flex min-h-screen items-center justify-center bg-surface p-4">
            <div className="max-w-md w-full text-center bg-white p-8 rounded-xl border border-border shadow-sm">
              <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="text-amber-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-charcoal mb-2">Application Pending</h2>
              <p className="text-sm text-muted mb-6">
                Your application to become a vendor is currently under review. 
                We usually review applications within 48 hours. Please check back later.
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/account" className="h-10 px-4 rounded border border-border text-charcoal text-sm font-bold flex items-center hover:bg-surface">
                  My Account
                </Link>
                <a href="mailto:support@isourcemarket.com" className="h-10 px-4 rounded bg-primary text-white text-sm font-bold flex items-center hover:bg-primary-hover">
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        );
      } else {
        // If rejected or suspended
        return (
          <div className="flex min-h-screen items-center justify-center bg-surface p-4">
            <div className="max-w-md w-full text-center bg-white p-8 rounded-xl border border-border shadow-sm">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="text-red-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-charcoal mb-2">Application Not Approved</h2>
              <p className="text-sm text-muted mb-6">
                Unfortunately, your application was not approved at this time. Please contact support for more details.
              </p>
              <a href="mailto:support@isourcemarket.com" className="inline-flex h-10 px-6 rounded bg-primary text-white text-sm font-bold items-center hover:bg-primary-hover">
                Contact Support
              </a>
            </div>
          </div>
        );
      }
    }
  }

  // 3. If no session or no vendor profile, show the application form
  // We dynamically import SellForm to avoid server/client mismatch
  const { default: SellForm } = await import("./SellForm");
  return <SellForm />;
}