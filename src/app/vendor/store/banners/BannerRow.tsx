"use client";
import { useState } from "react";
import { toggleBannerStatus, deleteStoreBanner } from "@/app/actions/store-banners";
import { Trash2, EyeOff, Eye, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export function BannerRow({ banner }: { banner: any }) {
  // Schedule status
  const now = new Date();
  const startsAt = banner.startsAt ? new Date(banner.startsAt) : null;
  const endsAt = banner.endsAt ? new Date(banner.endsAt) : null;
  const isScheduledFuture = startsAt && startsAt > now;
  const isExpired = endsAt && endsAt < now;
  const isLive = !isScheduledFuture && !isExpired;

  const scheduleLabel = () => {
    if (isScheduledFuture) {
      return `Starts ${startsAt!.toLocaleDateString()} at ${startsAt!.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
    if (isExpired) {
      return `Ended ${endsAt!.toLocaleDateString()}`;
    }
    if (endsAt) {
      return `Live until ${endsAt.toLocaleDateString()}`;
    }
    return null;
  };
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    await toggleBannerStatus(banner.id, banner.isActive);
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this banner permanently?")) return;
    setLoading(true);
    await deleteStoreBanner(banner.id);
    setLoading(false);
  }

  const moderationBadge = () => {
    const status = banner.approvalStatus || "APPROVED";
    if (status === "APPROVED") return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase tracking-wider">
        <CheckCircle2 size={10} /> Live
      </span>
    );
    if (status === "PENDING") return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded uppercase tracking-wider">
        <Clock size={10} /> Under Review
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase tracking-wider">
        <XCircle size={10} /> Rejected
      </span>
    );
  };

  return (
    <div className={`rounded-xl border bg-white overflow-hidden transition-opacity ${banner.isActive && banner.approvalStatus === "APPROVED" ? "border-border" : "border-border/50 opacity-70"}`}>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-64 h-32 relative bg-surface shrink-0">
          <img src={banner.desktopUrl} alt="Banner" className="w-full h-full object-cover" />
          {!banner.isActive && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-xs bg-red-500 px-2 py-1 rounded">HIDDEN</span>
            </div>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {moderationBadge()}
              {!banner.isActive && <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded uppercase">Hidden</span>}
              {scheduleLabel() && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  isScheduledFuture ? "bg-blue-100 text-blue-700" :
                  isExpired ? "bg-gray-100 text-gray-600" :
                  "bg-green-100 text-green-700"
                }`}>
                  {scheduleLabel()}
                </span>
              )}
            </div>
            <h3 className="font-bold text-charcoal">{banner.heading || "Untitled Banner"}</h3>
            <p className="text-sm text-muted line-clamp-1">{banner.description || "No description"}</p>
            {banner.ctaLabel && <p className="text-xs text-primary font-bold mt-2 inline-block border border-primary px-2 py-0.5 rounded">{banner.ctaLabel}</p>}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleToggle} disabled={loading} className="h-8 px-3 rounded border border-border text-xs font-bold hover:bg-surface flex items-center gap-1">
              {banner.isActive ? <><EyeOff size={12}/> Hide</> : <><Eye size={12}/> Show</>}
            </button>
            <button onClick={handleDelete} disabled={loading} className="h-8 px-3 rounded border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 flex items-center gap-1">
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Rejection reason banner */}
      {banner.approvalStatus === "REJECTED" && banner.rejectionReason && (
        <div className="border-t border-red-200 bg-red-50 px-4 py-3">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-0.5">Admin Rejection Reason</p>
              <p className="text-sm text-red-700">{banner.rejectionReason}</p>
              <p className="text-xs text-red-600 mt-2">Fix the issues and re-upload a new banner.</p>
            </div>
          </div>
        </div>
      )}

      {/* Pending note */}
      {banner.approvalStatus === "PENDING" && (
        <div className="border-t border-orange-200 bg-orange-50 px-4 py-2">
          <p className="text-xs text-orange-700">
            <Clock size={12} className="inline mr-1" /> This banner will go live once approved by an Isource admin (usually within 24 hours).
          </p>
        </div>
      )}
    </div>
  );
}