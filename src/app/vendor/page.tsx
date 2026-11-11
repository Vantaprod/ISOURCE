import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  AlertCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Star
} from "lucide-react";

export const dynamic = "force-dynamic";

function naira(kobo: number) {
  return "₦" + (kobo / 100).toLocaleString("en-NG", { maximumFractionDigits: 0 });
}

export default async function VendorDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.userId },
    include: {
      _count: { select: { products: true } }
    }
  });

  if (!vendor) redirect("/sell");

  // In a real app, you would fetch actual revenue and order stats here
  const totalSalesKobo = 0; 
  const itemsSold = 0;
  const pendingOrders = 0;

  return (
    <div className="space-y-6">
      {/* 1. Welcome Header & Alerts */}
      <div>
        <h1 className="text-2xl font-extrabold text-charcoal">
          Welcome back, {vendor.name}!
        </h1>
        <p className="text-sm text-muted mt-1">Here is what is happening in your store today.</p>
      </div>

      {vendor.status === "PENDING" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-amber-600 mt-0.5" size={20} />
          <div>
            <h3 className="text-sm font-bold text-amber-800">Application Under Review</h3>
            <p className="text-sm text-amber-700 mt-1">Your store is currently pending approval. You can set up your products, but you cannot sell until an admin approves your account.</p>
          </div>
        </div>
      )}

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-muted uppercase">Total Revenue</p>
            <TrendingUp className="text-green-500" size={18} />
          </div>
          <p className="text-2xl font-extrabold text-charcoal mt-2">{naira(totalSalesKobo)}</p>
          <p className="text-xs text-muted mt-1">Last 7 days</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-muted uppercase">Items Sold</p>
            <ShoppingBag className="text-primary" size={18} />
          </div>
          <p className="text-2xl font-extrabold text-charcoal mt-2">{itemsSold}</p>
          <p className="text-xs text-muted mt-1">Last 7 days</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-muted uppercase">Active Products</p>
            <Package className="text-blue-500" size={18} />
          </div>
          <p className="text-2xl font-extrabold text-charcoal mt-2">{vendor._count.products}</p>
          <p className="text-xs text-muted mt-1">Live in your store</p>
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sales Overview Placeholder */}
          <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="font-bold text-charcoal">Sales Overview</h2>
              <select className="text-sm border border-border rounded-lg px-3 py-1 outline-none">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
            <div className="p-10 flex items-center justify-center h-64 bg-surface/50">
              <p className="text-sm text-muted">No sales data yet. Share your store link to get your first sale!</p>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="font-bold text-charcoal">Recent Orders</h2>
              <Link href="/vendor/orders" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            <div className="p-10 text-center">
              <p className="text-sm text-muted">You have no pending orders right now.</p>
            </div>
          </div>
        </div>

        {/* Right Column (1 span) */}
        <div className="space-y-6">
          
          {/* Store Health (Seller Score) */}
          <div className="bg-white border border-border rounded-xl shadow-sm p-5">
            <h2 className="font-bold text-charcoal mb-4">Store Health</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-charcoal flex items-center gap-1"><ShieldCheck size={14}/> Fulfillment Rate</span>
                  <span className="text-green-600">100%</span>
                </div>
                <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-full"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-charcoal flex items-center gap-1"><Star size={14}/> Customer Rating</span>
                  <span className="text-muted">New</span>
                </div>
                <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-surface w-0"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-border rounded-xl shadow-sm p-5">
            <h2 className="font-bold text-charcoal mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/vendor/products/new" className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary hover:bg-surface transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Plus size={16} />
                  </div>
                  <span className="text-sm font-bold text-charcoal">Add New Product</span>
                </div>
                <ArrowRight size={16} className="text-muted group-hover:text-primary transition-colors" />
              </Link>
              
              <Link href="/vendor/orders" className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary hover:bg-surface transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <ShoppingBag size={16} />
                  </div>
                  <span className="text-sm font-bold text-charcoal">Manage Orders</span>
                </div>
                <ArrowRight size={16} className="text-muted group-hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}