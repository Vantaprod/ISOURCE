import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LayoutDashboard, Package, ShoppingBag, Megaphone, Truck, Store, Wallet, Settings, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  
  // If not logged in, this will correctly redirect to the login page
  if (!session) {
    redirect("/login");
  }

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.userId },
  });

  if (!vendor) {
    redirect("/sell");
  }

  const vendorName = vendor.name || "My Store";
  const vendorStatus = vendor.status || "PENDING";

  if (vendorStatus !== "APPROVED") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-xl border border-border shadow-sm">
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="text-amber-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-charcoal mb-2">Application Under Review</h2>
          <p className="text-sm text-muted mb-6">
            Hi {vendorName}, your seller account is currently <strong>{vendorStatus}</strong>. 
            Our team is reviewing your application. You will be notified once approved.
          </p>
          <Link href="https://www.isourcemarket.com" className="inline-block h-10 px-6 rounded bg-primary text-white text-sm font-bold leading-10 hover:bg-primary-hover">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const NAV_LINKS = [
    { href: "/vendor", label: "Overview", icon: LayoutDashboard },
    { href: "/vendor/products", label: "Products", icon: Package },
    { href: "/vendor/orders", label: "Orders", icon: ShoppingBag },
    { href: "/vendor/shipping", label: "Shipping & Dispatch", icon: Truck },
    { href: "/vendor/advertising", label: "Advertising", icon: Megaphone },
    { href: "/vendor/store", label: "Store Design", icon: Store },
    { href: "/vendor/finance", label: "Finance", icon: Wallet },
    { href: "/vendor/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-surface flex">
      <aside className="w-64 bg-white border-r border-border hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-extrabold text-charcoal truncate" title={vendorName}>
            {vendorName}
          </h2>
          <p className="text-xs text-muted mt-1">Seller Workspace</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-charcoal hover:bg-surface hover:text-primary transition-colors">
                <Icon size={18} className="text-muted" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <Link href="https://www.isourcemarket.com" className="flex items-center justify-center w-full h-10 rounded-lg border border-border text-sm font-bold text-charcoal hover:bg-surface transition-colors">
            Back to Storefront
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <div className="md:hidden bg-white border-b border-border p-4 flex items-center justify-between">
          <span className="font-bold text-charcoal truncate">{vendorName}</span>
          <Link href="https://www.isourcemarket.com" className="text-xs font-bold text-primary">Storefront</Link>
        </div>
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}