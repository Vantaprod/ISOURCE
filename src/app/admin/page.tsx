import Link from "next/link";
import { Users, Store, Clock, ShieldCheck, Package, ShoppingBag, DollarSign, Wallet, Activity, Layers, ClipboardList, type LucideIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatNairaShort } from "@/lib/format";

export default async function AdminDashboard() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    customerCount, vendorCount, pendingVendorCount, brandCount, pendingBrandCount,
    productCount, pendingProductCount, activeOrderCount, gmvData, collectedData,
    recentOrders, recentVendors, recentBrands, topCategories,
    recentOrdersForChart, allOrdersForStatus
  ] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.vendor.count({ where: { status: "APPROVED" } }),
    prisma.vendor.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW", "PENDING"] } } }),
    prisma.brand.count({ where: { status: "APPROVED" } }),
    prisma.brand.count({ where: { status: "PENDING" } }),
    prisma.product.count(),
    prisma.product.count({ where: { approvalStatus: "PENDING" } }),
    prisma.order.count({ where: { status: { in: ["PENDING", "PROCESSING", "SHIPPED"] } } }),
    prisma.order.aggregate({ _sum: { totalKobo: true } }),
    prisma.order.aggregate({ _sum: { totalKobo: true }, where: { paymentStatus: "PAID" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { user: true } }),
    prisma.vendor.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.brand.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.product.groupBy({ by: ["categoryId"], _count: true, orderBy: { _count: { categoryId: "desc" } }, take: 5 }),
    prisma.order.findMany({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.order.groupBy({ by: ["status"], _count: true })
  ]);

  const gmv = gmvData._sum.totalKobo || 0;
  const collected = collectedData._sum.totalKobo || 0;

  const salesByDay: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    salesByDay[d.toISOString().split('T')[0]] = 0;
  }
  recentOrdersForChart.forEach(o => {
    const day = o.createdAt.toISOString().split('T')[0];
    if (salesByDay[day] !== undefined) {
      salesByDay[day] += o.totalKobo;
    }
  });

  const chartData = Object.entries(salesByDay).map(([date, total]) => ({
    date: new Date(date).toLocaleDateString("en-NG", { month: "short", day: "numeric" }),
    total
  }));
  
  const maxSales = Math.max(...chartData.map(d => d.total), 1);
  
  let pathD = `M 10 ${150 - (chartData[0].total / maxSales) * 120}`;
  chartData.forEach((d, i) => {
    if (i === 0) return;
    const x = 10 + (i / 6) * 380;
    const y = 150 - (d.total / maxSales) * 120;
    pathD += ` L ${x} ${y}`;
  });

  const statusCounts = { DELIVERED: 0, PROCESSING: 0, SHIPPED: 0, PENDING: 0, CANCELLED: 0 };
  allOrdersForStatus.forEach(o => {
    if (statusCounts[o.status as keyof typeof statusCounts] !== undefined) {
      statusCounts[o.status as keyof typeof statusCounts] = o._count;
    }
  });
  const totalOrders = Object.values(statusCounts).reduce((a, b) => a + b, 0);
  
  const CIRCUMFERENCE = 251.2;
  let currentOffset = 0;
  
  const donutSlices = [
    { label: "Delivered", key: "DELIVERED", color: "#16A34A" },
    { label: "Processing", key: "PROCESSING", color: "#F07824" },
    { label: "Shipped", key: "SHIPPED", color: "#3B82F6" },
    { label: "Pending", key: "PENDING", color: "#9CA3AF" },
    { label: "Cancelled", key: "CANCELLED", color: "#DC2626" },
  ].map(slice => {
    const count = statusCounts[slice.key as keyof typeof statusCounts];
    const percentage = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
    const dashArray = totalOrders > 0 ? (count / totalOrders) * CIRCUMFERENCE : 0;
    const dashOffset = -currentOffset;
    currentOffset += dashArray;
    return { ...slice, count, percentage, dashArray, dashOffset };
  });

  const categories = await prisma.category.findMany();
  const topCatData = topCategories.map(tc => ({
    name: categories.find(c => c.id === tc.categoryId)?.name || "Unknown",
    count: tc._count
  }));
  const maxCatCount = Math.max(...topCatData.map(c => c.count), 1);

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-[1fr_300px] gap-4">
        <div className="rounded-2xl bg-gradient-to-r from-[#FDF6ED] to-[#F4F5F7] p-6 md:p-8 flex flex-col justify-center relative overflow-hidden border border-border">
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-extrabold text-charcoal">Welcome back, Admin!</h1>
            <p className="text-sm text-muted mt-1">{"Here's what's happening across the Isource marketplace today."}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-border p-6 flex flex-col justify-center">
          <p className="text-sm font-bold text-charcoal mb-2">Platform Health</p>
          <div className="flex items-center gap-2 text-success text-sm font-bold bg-success/10 px-3 py-1.5 rounded-md w-fit">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" /> Healthy
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard icon={Users} label="Total Customers" value={customerCount} />
        <StatCard icon={Store} label="Registered Vendors" value={vendorCount} />
        <StatCard icon={Clock} label="Pending Vendor Apps" value={pendingVendorCount} />
        <StatCard icon={ShieldCheck} label="Verified Brands" value={brandCount} />
        <StatCard icon={ShieldCheck} label="Pending Brands" value={pendingBrandCount} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard icon={Package} label="Total Products" value={productCount} />
        <StatCard icon={Clock} label="Pending Approvals" value={pendingProductCount} />
        <StatCard icon={ShoppingBag} label="Active Orders" value={activeOrderCount} />
        <StatCard icon={DollarSign} label="Gross Merch. Value" value={formatNairaShort(gmv)} />
        <StatCard icon={Wallet} label="Collected Payments" value={formatNairaShort(collected)} />
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr_1fr] gap-4">
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-charcoal text-sm flex items-center gap-2"><Activity size={16} className="text-primary"/> Sales Overview</h2>
            <span className="text-xs text-muted">Last 7 days</span>
          </div>
          <div className="h-48 w-full relative">
            <svg viewBox="0 0 400 150" className="w-full h-full">
              <line x1="0" y1="0" x2="400" y2="0" stroke="#f0f0f0" strokeWidth="1" />
              <line x1="0" y1="75" x2="400" y2="75" stroke="#f0f0f0" strokeWidth="1" />
              <line x1="0" y1="150" x2="400" y2="150" stroke="#e5e7eb" strokeWidth="1" />
              
              {totalOrders > 0 ? (
                <>
                  <path d={pathD} fill="none" stroke="#F07824" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d={`${pathD} L 390 150 L 10 150 Z`} fill="#F07824" fillOpacity="0.05" />
                  {chartData.map((d, i) => {
                    const x = 10 + (i / 6) * 380;
                    const y = 150 - (d.total / maxSales) * 120;
                    return <circle key={i} cx={x} cy={y} r="3" fill="#F07824" />;
                  })}
                </>
              ) : (
                <text x="200" y="80" textAnchor="middle" fill="#9CA3AF" fontSize="12">No sales data yet</text>
              )}
            </svg>
          </div>
          <div className="flex justify-between text-[10px] text-muted mt-2">
            {chartData.map(d => <span key={d.date}>{d.date}</span>)}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-charcoal text-sm flex items-center gap-2"><Layers size={16} className="text-primary"/> Order Distribution</h2>
          </div>
          <div className="flex items-center justify-center relative h-40">
             <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
                {totalOrders > 0 && donutSlices.map(slice => (
                  <circle key={slice.key} cx="50" cy="50" r="40" fill="none" stroke={slice.color} strokeWidth="15" strokeDasharray={`${slice.dashArray} ${CIRCUMFERENCE}`} strokeDashoffset={slice.dashOffset} />
                ))}
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-charcoal">{totalOrders}</span>
                <span className="text-[10px] text-muted">Total Orders</span>
             </div>
          </div>
          <div className="space-y-1 mt-4">
             {donutSlices.map(slice => (
               <div key={slice.key} className="flex items-center justify-between text-xs">
                 <span className="flex items-center gap-1 text-muted"><div className="h-2 w-2 rounded-full" style={{ backgroundColor: slice.color }}/> {slice.label}</span> 
                 <span>{slice.percentage}%</span>
               </div>
             ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-charcoal text-sm flex items-center gap-2"><ClipboardList size={16} className="text-primary"/> Top Categories</h2>
          </div>
          <div className="space-y-3">
            {topCatData.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-xs mb-1"><span className="text-charcoal font-medium">{c.name}</span> <span className="text-muted">{c.count}</span></div>
                <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                   <div className="h-full bg-primary rounded-full" style={{ width: `${(c.count / maxCatCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr_1fr] gap-4">
        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-charcoal text-sm flex items-center gap-2"><ShoppingBag size={16} className="text-primary"/> Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="text-muted uppercase border-b border-border"><tr><th className="px-4 py-2">Order #</th><th className="px-4 py-2">Customer</th><th className="px-4 py-2">Total</th><th className="px-4 py-2">Status</th></tr></thead>
            <tbody className="divide-y divide-border">
              {recentOrders.map(o => (
                <tr key={o.id}>
                  <td className="px-4 py-3 font-mono text-charcoal">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-muted truncate max-w-[100px]">{o.shippingFirstName} {o.shippingLastName}</td>
                  <td className="px-4 py-3 font-bold">{formatNairaShort(o.totalKobo)}</td>
                  <td className="px-4 py-3"><span className="bg-success/10 text-success px-2 py-0.5 rounded text-[10px] font-bold">{o.status}</span></td>
                </tr>
              ))}
              {recentOrders.length === 0 && <tr><td colSpan={4} className="text-center py-6 text-muted">No orders yet.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-charcoal text-sm flex items-center gap-2"><Store size={16} className="text-primary"/> Vendor Performance</h2>
            <Link href="/admin/vendors" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="text-muted uppercase border-b border-border"><tr><th className="px-4 py-2">Vendor</th><th className="px-4 py-2">Status</th></tr></thead>
            <tbody className="divide-y divide-border">
              {recentVendors.map(v => (
                <tr key={v.id}>
                  <td className="px-4 py-3 font-medium text-charcoal flex items-center gap-2"><div className="h-6 w-6 rounded bg-surface flex items-center justify-center text-[10px]">{v.name.charAt(0)}</div> {v.name}</td>
                  <td className="px-4 py-3"><span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">{v.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-charcoal text-sm flex items-center gap-2"><ShieldCheck size={16} className="text-primary"/> Recent Brand Apps</h2>
            <Link href="/admin/brands" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="text-muted uppercase border-b border-border"><tr><th className="px-4 py-2">Brand</th><th className="px-4 py-2">Status</th></tr></thead>
            <tbody className="divide-y divide-border">
              {recentBrands.map(b => (
                <tr key={b.id}>
                  <td className="px-4 py-3 font-medium text-charcoal">{b.name}</td>
                  <td className="px-4 py-3"><span className="bg-warning/10 text-warning px-2 py-0.5 rounded text-[10px] font-bold">{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: LucideIcon, label: string, value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="flex items-center gap-2 text-muted text-[10px] uppercase font-bold tracking-wider mb-2">
        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Icon size={12} /></div>
        {label}
      </div>
      <p className="text-2xl font-extrabold text-charcoal">{value}</p>
    </div>
  );
}