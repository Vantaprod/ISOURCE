"use client";
import { useState, useTransition } from "react";
import { createShipment } from "./shipment-actions";
import { Truck } from "lucide-react";
import type { ShipmentCarrier } from "@prisma/client";

export function CreateShipmentModal({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();
  const [show, setShow] = useState(false);
  const [carrier, setCarrier] = useState<ShipmentCarrier>("ISOURCE");
  const [tracking, setTracking] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        await createShipment(orderId, carrier, tracking);
        setShow(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create shipment");
      }
    });
  }

  return (
    <div>
      <button onClick={() => setShow(true)} className="h-8 px-3 rounded bg-charcoal text-white text-xs font-semibold hover:bg-charcoal/90 flex items-center gap-1">
        <Truck size={12} /> Dispatch
      </button>

      {show && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4">Create Shipment</h3>
            {error && <p className="text-sm text-danger mb-3">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1">Carrier</label>
                <select value={carrier} onChange={(e) => setCarrier(e.target.value as ShipmentCarrier)} className="h-10 w-full rounded border border-border px-3 text-sm bg-white">
                  <option value="ISOURCE">Isource Logistics</option>
                  <option value="VENDOR">Vendor Direct</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Tracking Number</label>
                <input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="e.g., ISL-123456" className="h-10 w-full rounded border border-border px-3 text-sm" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setShow(false)} className="h-9 px-4 rounded border border-border text-sm">Cancel</button>
                <button type="submit" disabled={isPending} className="h-9 px-4 rounded bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-50">
                  {isPending ? "Dispatching..." : "Confirm Dispatch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}