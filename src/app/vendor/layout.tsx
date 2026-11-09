import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  // Fetch the vendor profile
  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.userId },
  });

  // If they don't have a vendor profile at all, send them to apply
  if (!vendor) {
    redirect("/sell");
  }

  // If they are pending, show a nice waiting screen instead of crashing
  if (vendor.status !== "APPROVED") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-xl border border-border shadow-sm">
          <h2 className="text-2xl font-bold text-charcoal mb-2">Application Under Review</h2>
          <p className="text-sm text-muted mb-6">
            Hi {vendor.name}, your seller account is currently <strong>{vendor.status}</strong>. 
            Our team is reviewing your application. You will be notified once approved.
          </p>
          <Link href="/" className="inline-block h-10 px-6 rounded bg-primary text-white text-sm font-bold leading-10 hover:bg-primary-hover">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // If approved, render the normal dashboard
  return <>{children}</>;
}