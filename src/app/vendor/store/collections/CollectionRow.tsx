"use client";
import { useState } from "react";
import Link from "next/link";
import { deleteCollection } from "@/app/actions/store-collections";
import { Layers, Pencil, Trash2, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export function CollectionRow({ collection }: { collection: any }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${collection.name}"? Products will NOT be deleted.`)) return;
    setDeleting(true);
    await deleteCollection(collection.id);
    setDeleting(false);
  }

  const moderationBadge = () => {
    const status = collection.approvalStatus || "APPROVED";
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
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      <div className="p-4 flex items-center gap-4">
        <div className="h-16 w-16 rounded-lg bg-surface border border-border flex items-center justify-center overflow-hidden shrink-0">
          {collection.imageUrl ? (
            <img src={collection.imageUrl} alt={collection.name} className="h-full w-full object-cover" />
          ) : (
            <Layers size={24} className="text-muted" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">{moderationBadge()}</div>
          <h3 className="font-bold text-charcoal">{collection.name}</h3>
          <p className="text-xs text-muted">{collection._count.products} products · /{collection.slug}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/vendor/store/collections/${collection.id}`}
            className="h-9 px-3 rounded-md border border-border text-sm font-bold text-charcoal hover:bg-surface flex items-center gap-1">
            <Pencil size={14} /> Edit
          </Link>
          <button onClick={handleDelete} disabled={deleting}
            className="h-9 px-3 rounded-md border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 flex items-center gap-1 disabled:opacity-50">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      {/* Rejection reason */}
      {collection.approvalStatus === "REJECTED" && collection.rejectionReason && (
        <div className="border-t border-red-200 bg-red-50 px-4 py-3">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-0.5">Admin Rejection Reason</p>
              <p className="text-sm text-red-700">{collection.rejectionReason}</p>
            </div>
          </div>
        </div>
      )}

      {collection.approvalStatus === "PENDING" && (
        <div className="border-t border-orange-200 bg-orange-50 px-4 py-2">
          <p className="text-xs text-orange-700">
            <Clock size={12} className="inline mr-1" /> Awaiting admin approval (usually within 24 hours).
          </p>
        </div>
      )}
    </div>
  );
}