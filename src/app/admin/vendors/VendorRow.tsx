"use client";
import { useState, useTransition } from "react";
import { updateVendorStatus } from "./actions";
import type { VendorStatus } from "@prisma/client";

const STATUSES: VendorStatus[] = ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "SUSPENDED"];

export function VendorRow({ vendor }: { vendor: { id: string; name: string; email: string; productCount: number; location: string; status: VendorStatus } }) {
  const [isPending, startTransition] = useTransition();
  const [currentStatus, setCurrentStatus] = useState(vendor.status);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as VendorStatus;
    setCurrentStatus(newStatus);
    startTransition(async () => { await updateVendorStatus(vendor.id, newStatus); });
  }

  return (
    <tr className={`hover:bg-surface/30 transition-colors ${isPending ? "opacity-50" : ""}`}>
      <td className="px-5 py-4 font-semibold text-charcoal">{vendor.name}</td>
      <td className="px-5 py-4 text-muted">{vendor.email}</td>
      <td className="px-5 py-4 font-medium">{vendor.productCount}</td>
      <td className="px-5 py-4 text-muted">{vendor.location}</td>
      <td className="px-5 py-4">
        <select value={currentStatus} onChange={handleChange} disabled={isPending} className={`h-8 rounded border border-border px-2 text-xs font-bold ${currentStatus === "APPROVED" ? "bg-success/10 text-success" : currentStatus === "SUSPENDED" || currentStatus === "REJECTED" ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning"}`}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </td>
    </tr>
  );
}