"use client";
import { useTransition } from "react";
import { markReadyForPickup } from "@/app/actions/vendor-shipping";

export function MarkReadyButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      onClick={() => startTransition(async () => { await markReadyForPickup(id); })}
      disabled={isPending}
      className="h-7 px-3 rounded bg-primary text-white text-xs font-bold hover:bg-primary-hover disabled:opacity-50"
    >
      {isPending ? "..." : "Ready for Pickup"}
    </button>
  );
}