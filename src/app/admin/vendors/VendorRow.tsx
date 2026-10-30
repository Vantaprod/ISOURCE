"use client";
import { useState, useTransition } from "react";
import { updateVendorStatus } from "./actions";
import type { VendorStatus } from "@prisma/client";

const STATUSES: VendorStatus[] = ["PENDING", "APPROVED", "SUSPENDED"];

export function VendorRow({ vendor }: { vendor: { id: string; name: string; email: string; productCount: number; status: VendorStatus } }) {
  const [isPending, startTransition] = useTransition();
  const [currentStatus, setCurrentStatus] = useState(vendor.status);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as VendorStatus;
    setCurrentStatus(newStatus);
    startTransition(async () => {
      await updateVendorStatus(vendor.id, newStatus);
    });
  }

  return (
    <tr className={`hover:bg-surface/50 ${isPending ? "opacity-50" : ""}`}>
      <td className="px-4 py-3 font-medium">{vendor.name}</td>
      <td className="px-4 py-3 text-muted">{vendor.email}</td>
      <td className="px-4 py-3">{vendor.productCount}</td>
      <td className="px-4 py-3">
        <select
          value={currentStatus}
          onChange={handleChange}
          disabled={isPending}
          className={`h-8 rounded border border-border px-2 text-xs font-semibold ${
            currentStatus === "APPROVED" ? "bg-success/10 text-success" :
            currentStatus === "SUSPENDED" ? "bg-danger/10 text-danger" :
            "bg-warning/10 text-warning"
          }`}
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </td>
      <td className="px-4 py-3 text-right text-xs text-muted">
        {currentStatus === "PENDING" ? "Needs review" : "—"}
      </td>
    </tr>
  );
}