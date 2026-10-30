import Link from "next/link";
import { Package, Users, DollarSign, Megaphone, CheckCircle2, ChevronRight, Plus, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { formatNairaShort } from "@/lib/format";
import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export default async function BrandDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");

  const brand = await prisma.brand.findFirst({
    where: { ownerId: session.userId },
    include: { products: true },
  });

  if (!brand) return (
    <div className="rounded-xl border border-warning/30 bg-warning/5 p-10 text-center">
      <AlertTriangle className="mx-auto text-warning mb-4" size={40} />
      <h2 className="text-xl font-bold text-charcoal">No Brand Registered</h2>
      <p className="text-sm text-muted mt-2">Create a brand profile to access this dashboard.</p>
      <Link href="/brand/apply" className="inline-block mt-6 h-10 px-6 leading-10 rounded-md bg-primary text-white font-bold text-sm">Register Brand</Link>
    </div>
  );

  const totalProducts = brand.products.length;
  const totalSales = 0;
  const authorizedSellers = 0;

  // 6-month bar chart
  const months = ["Jan","Feb","Mar","Apr","May","Jun"];
  const monthData = months.map((m) => ({ m, v: 20 + Math.random() * 80 }));
  const maxV = Math.max(...monthData.map(d => d.v));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal">{brand.name} Brand Dashboard</h1>
          <p className="text-sm text-muted mt-1">Manage your brand, products, and authorised sellers.</p>
        </div>
        <div className="flex items-center gap-3">
          {brand.status === "APPROVED" && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold"><CheckCircle2 size={12} /> Verified</span>}
          <Link href={`/search?q=${brand.name}`} className="h-9 px-4 leading-9 rounded-md bg-white border border-border text-charcoal text-sm font-bold hover:border-primary">Brand Store</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-2 text-muted mb-2"><Package size={14} /><p className="text-[10px] uppercase font-bold">Total Products</p></div>
          <p className="text-2xl font-extrabold text-charcoal">{totalProducts}</p>
          <p className="text-[10px] text-success mt-1 flex items-center gap-1"><TrendingUp size={10} /> +8% from last month</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-2 text-muted mb-2"><Users size={14} /><p className="text-[10px] uppercase font-bold">Authorised Sellers</p></div>
          <p className="text-2xl font-extrabold text-charcoal">{authorizedSellers}</p>
          <Link href="/brand/sellers" className="text-[10px] text-primary mt-1 flex items-center gap-1">View sellers <ChevronRight size={10} /></Link>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-2 text-muted mb-2"><DollarSign size={14} /><p className="text-[10px] uppercase font-bold">Total Sales</p></div>
          <p className="text-2xl font-extrabold text-charcoal">{formatNairaShort(totalSales)}</p>
          <p className="text-[10px] text-muted mt-1">All time</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-2 text-muted mb-2"><Megaphone size={14} /><p className="text-[10px] uppercase font-bold">Active Campaigns</p></div>
          <p className="text-2xl font-extrabold text-charcoal">0</p>
          <Link href="/brand/campaigns" className="text-[10px] text-primary mt-1 flex items-center gap-1">Manage campaigns <ChevronRight size={10} /></Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        {/* Brand Performance */}
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-charcoal text-sm">Brand Performance</h2>
            <span className="text-xs text-muted">Last 6 months</span>
          </div>
          <div className="flex items-end justify-between gap-3 h-48">
            {monthData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <p className="text-[10px] text-muted">â‚¦{Math.round(d.v)}K</p>
                <div className="w-full bg-primary rounded-t" style={{ height: `${(d.v / maxV) * 80}%` }} />
                <span className="text-[10px] text-muted">{d.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-charcoal text-sm">Recent Activity</h2>
            <Link href="/account/notifications" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-xs text-muted text-center py-8">No recent activity.</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-white p-5">
        <h2 className="font-bold text-charcoal text-sm mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/brand/products" className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary transition-colors"><div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center"><Package size={16} className="text-primary" /></div><div><p className="text-xs font-bold">Manage Products</p><p className="text-[10px] text-muted">Edit catalogue</p></div></Link>
          <Link href="/brand/sellers" className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary transition-colors"><div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center"><Users size={16} className="text-primary" /></div><div><p className="text-xs font-bold">View Sellers</p><p className="text-[10px] text-muted">Authorised sellers</p></div></Link>
          <Link href="/brand/campaigns" className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary transition-colors"><div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center"><Megaphone size={16} className="text-primary" /></div><div><p className="text-xs font-bold">Create Campaign</p><p className="text-[10px] text-muted">Launch promotion</p></div></Link>
          <Link href="/brand/verification" className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary transition-colors"><div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center"><Plus size={16} className="text-primary" /></div><div><p className="text-xs font-bold">Upload Assets</p><p className="text-[10px] text-muted">Logos & media</p></div></Link>
        </div>
      </div>
    </div>
  );
}