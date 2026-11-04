"use client";
import { Clock, XCircle } from "lucide-react";

export function PendingWrapper({
  status,
  children,
}: {
  status: "APPROVED" | "PENDING" | "REJECTED";
  children: React.ReactNode;
}) {
  if (status === "APPROVED") return <>{children}</>;

  const isPending = status === "PENDING";

  return (
    <div className="relative">
      {/* Visual overlay */}
      <div className={`opacity-90 ${isPending ? "" : "grayscale"}`}>{children}</div>

      {/* Floating badge */}
      <div className="absolute -top-3 left-4 z-10">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg ${
          isPending
            ? "bg-yellow-400 text-charcoal"
            : "bg-red-500 text-white"
        }`}>
          {isPending ? <><Clock size={10} /> Pending Approval</> : <><XCircle size={10} /> Rejected</>}
        </div>
      </div>
    </div>
  );
}