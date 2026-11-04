import { getStoreAnalytics } from "@/app/actions/store-analytics";
import { formatNairaShort } from "@/lib/format";
import Link from "next/link";
import {
  Eye,
  Users,
  Heart,
  ShoppingBag,
  TrendingUp,
  BarChart3,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StoreAnalyticsPage() {
  const data = await getStoreAnalytics();
  const maxDaily = Math.max(...data.daily.map((d) => d.count), 1);
  const hasAnyTraffic = data.totalViews > 0;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
            <BarChart3 size={22} /> Store Analytics
          </h1>
          <p className="text-sm text-muted">
            Performance for <span className="font-medium text-charcoal">{data.vendorName}</span> at{" "}
            <Link href={`/brand/${data.storeSlug}`} target="_blank" className="font-mono text-primary hover:underline">
              /brand/{data.storeSlug}
            </Link>
          </p>
        </div>
        <Link
          href={`/brand/${data.storeSlug}`}
          target="_blank"
          className="h-10 px-4 rounded-lg border border-border text-sm font-bold text-charcoal hover:bg-surface flex items-center gap-2"
        >
          View Store <ArrowRight size={14} />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 text-muted mb-2">
            <Eye size={16} /> <span className="text-xs font-bold uppercase">Total Views</span>
          </div>
          <p className="text-3xl font-extrabold text-charcoal">{data.totalViews.toLocaleString()}</p>
          <p className="text-xs text-muted mt-1">{data.views30.toLocaleString()} in last 30 days</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 text-muted mb-2">
            <Users size={16} /> <span className="text-xs font-bold uppercase">Unique Visitors</span>
          </div>
          <p className="text-3xl font-extrabold text-charcoal">{data.uniqueVisitors.toLocaleString()}</p>
          <p className="text-xs text-muted mt-1">Based on hashed IP</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 text-muted mb-2">
            <Heart size={16} /> <span className="text-xs font-bold uppercase">Followers</span>
          </div>
          <p className="text-3xl font-extrabold text-charcoal">{data.followers.toLocaleString()}</p>
          <p className="text-xs text-muted mt-1">Customers following your store</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 text-muted mb-2">
            <ShoppingBag size={16} /> <span className="text-xs font-bold uppercase">Attributed Orders</span>
          </div>
          <p className="text-3xl font-extrabold text-charcoal">{data.orderCount.toLocaleString()}</p>
          <p className="text-xs text-muted mt-1">{formatNairaShort(data.revenueKobo)} revenue</p>
        </div>
      </div>

      {/* 30-day chart */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-charcoal flex items-center gap-2">
              <TrendingUp size={18} /> Traffic (Last 30 Days)
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Daily storefront views. Peak: {maxDaily} view{maxDaily === 1 ? "" : "s"}
            </p>
          </div>
          <span className="text-2xl font-extrabold text-primary">{data.views30.toLocaleString()}</span>
        </div>

        {!hasAnyTraffic ? (
          <div className="text-center py-12 text-muted text-sm">
            <BarChart3 size={32} className="mx-auto mb-3 opacity-40" />
            <p>No traffic recorded yet.</p>
            <p className="text-xs mt-1">Share your store link to start collecting views.</p>
          </div>
        ) : (
          <div className="flex items-end gap-1 h-40">
            {data.daily.map((d, i) => {
              const height = d.count === 0 ? 2 : Math.max(2, (d.count / maxDaily) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group" title={`${d.label}: ${d.count} views`}>
                  <span className="text-[9px] font-bold text-charcoal opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.count}
                  </span>
                  <div
                    className="w-full rounded-t bg-primary/70 group-hover:bg-primary transition-colors"
                    style={{ height: `${height}%` }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {hasAnyTraffic && (
          <div className="flex justify-between text-[10px] text-muted mt-2">
            <span>{data.daily[0]?.label}</span>
            <span>{data.daily[Math.floor(data.daily.length / 2)]?.label}</span>
            <span>{data.daily[data.daily.length - 1]?.label}</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Top Referrers */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-bold text-charcoal mb-4">Top Traffic Sources</h2>
          {data.referrers.length === 0 ? (
            <p className="text-sm text-muted">No referrer data yet.</p>
          ) : (
            <div className="space-y-2">
              {data.referrers.map((r, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                  <span className="text-charcoal truncate font-medium">{r.source}</span>
                  <span className="text-muted font-bold">{r.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Not-yet-tracked */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-bold text-charcoal mb-1 flex items-center gap-2">
            <AlertCircle size={16} className="text-orange-500" /> Not Tracked Yet
          </h2>
          <p className="text-xs text-muted mb-4">
            These metrics require additional event tracking. Reach out if you want them enabled.
          </p>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-border" /> Product click-through rate</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-border" /> Banner CTA clicks</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-border" /> Collection clicks</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-border" /> Store-attributed add-to-cart rate</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-border" /> Conversion rate</li>
          </ul>
        </div>
      </div>
    </div>
  );
}