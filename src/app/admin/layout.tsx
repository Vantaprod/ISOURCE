import Link from "next/link";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminUserNav } from "@/components/admin/AdminUserNav";
import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingCart,
  Megaphone,
  Truck,
  Settings,
  ShieldAlert,
  Tag
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  
  // 🚨 SECURITY CHECK: Only ADMIN can access this route
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  const adminUser = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  const NAV_LINKS = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/vendors", label: "Vendors", icon: Store },
    { href: "/admin/users", label: "Customers", icon: Users },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/logistics", label: "Logistics", icon: Truck },
    { href: "/admin/advertising", label: "Advertising", icon: Megaphone },
    { href: "/admin/moderation", label: "Moderation", icon: ShieldAlert },
    { href: "/admin/brands", label: "Brands", icon: Tag },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="w-64 bg-charcoal text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-extrabold tracking-tight text-primary">Isource Admin Studio</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Icon size={18} className="text-gray-400" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6">
          <div className="flex-1">
            {/* Could add a global admin search bar here */}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-bold text-charcoal hover:text-primary transition-colors">
              Exit to Storefront
            </Link>
            <AdminUserNav 
              name={adminUser?.name || "Admin"} 
              email={adminUser?.email || "admin@isource.com"} 
              role={adminUser?.role || "ADMIN"} 
            />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}