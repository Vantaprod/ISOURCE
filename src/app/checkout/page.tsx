"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { PRODUCTS } from "@/data/products";
import { formatNairaShort } from "@/lib/format";
import { NIGERIAN_STATES, DELIVERY_LABELS, DELIVERY_METHODS, type CheckoutFormData } from "@/lib/checkout-schema";
import { placeOrder } from "./actions";
import { getShippingQuote } from "@/app/actions/shipping";
import { getPickupStationsByState } from "@/app/actions/pickup-stations";

type PickupStation = { id: string; name: string; address: string; zone: { name: string } };

const initialForm: CheckoutFormData = {
  email: "", phone: "", firstName: "", lastName: "", address: "",
  city: "", state: "Lagos", instructions: "",
  deliveryMethod: "home-delivery", paymentMethod: "paystack",
};

export default function CheckoutPage() {
  const { lines, ready } = useCart();
  const router = useRouter();
  const [form, setForm] = useState<CheckoutFormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [shippingFeeKobo, setShippingFeeKobo] = useState(0);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const [pickupStations, setPickupStations] = useState<PickupStation[]>([]);
  const [selectedStationId, setSelectedStationId] = useState<string>("");
  const [policyAccepted, setPolicyAccepted] = useState(false);

  const isPickup = form.deliveryMethod === "pickup-station";

  const detailed = useMemo(() => {
    return lines.flatMap((line) => {
      const product = PRODUCTS.find((p) => p.id === line.productId);
      if (!product) return [];
      const variant = line.variantId ? product.variants?.find((v) => v.id === line.variantId) : undefined;
      const unitKobo = variant?.priceKobo ?? product.priceKobo;
      return [{ productId: line.productId, qty: line.qty, name: product.name, unitKobo }];
    });
  }, [lines]);

  const subtotalKobo = detailed.reduce((s, l) => s + l.unitKobo * l.qty, 0);

  // Fetch pickup stations when state or method changes
  useEffect(() => {
    if (!isPickup) { setPickupStations([]); setSelectedStationId(""); return; }
    getPickupStationsByState(form.state).then((stations) => {
      setPickupStations(stations);
      setSelectedStationId(stations.length > 0 ? stations[0].id : "");
    });
  }, [form.state, isPickup]);

  // Fetch shipping quote
  useEffect(() => {
    if (detailed.length === 0) return;
    setIsCalculating(true);
    setShippingError(null);
    const t = setTimeout(async () => {
      const res = await getShippingQuote({
        items: detailed.map(d => ({ productId: d.productId, quantity: d.qty })),
        customerState: form.state,
        isPickup,
      });
      if ("error" in res) { setShippingError(res.error); setShippingFeeKobo(0); }
      else { setShippingFeeKobo(res.quote.feeKobo); }
      setIsCalculating(false);
    }, 400);
    return () => clearTimeout(t);
  }, [detailed, form.state, isPickup]);

  const totalKobo = subtotalKobo + shippingFeeKobo;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!policyAccepted) { setSubmitError("Please accept the shipping policy."); return; }
    if (isPickup && !selectedStationId) { setSubmitError("Please select a pickup station."); return; }

    setSubmitting(true);
    try {
      const res = await placeOrder(
        detailed.map(d => ({ productId: d.productId, quantity: d.qty, unitPriceKobo: d.unitKobo })),
        form.state,
        isPickup,
        isPickup ? selectedStationId : null
      );
      if (res?.error) { setSubmitError(res.error); setSubmitting(false); }
      else if (res?.redirectUrl) { window.location.href = res.redirectUrl; }
    } catch (err: any) {
      setSubmitError(err.message);
      setSubmitting(false);
    }
  }

  if (!ready) return <div className="p-10 text-center">Loading cart...</div>;
  if (detailed.length === 0) return <div className="p-10 text-center">Cart is empty</div>;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-2xl font-extrabold text-charcoal">Checkout</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-charcoal mb-1">Delivery State</label>
            <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="h-10 w-full rounded border border-border px-3 text-sm bg-white">
              {NIGERIAN_STATES.map((st) => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-charcoal mb-1">Delivery Method</label>
            <div className="flex gap-4">
              {DELIVERY_METHODS.map((m) => (
                <label key={m} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="dm" value={m}
                    checked={form.deliveryMethod === m}
                    onChange={() => setForm({ ...form, deliveryMethod: m as any })}
                    className="w-4 h-4 text-primary" />
                  <span className="text-sm text-charcoal">{DELIVERY_LABELS[m]}</span>
                </label>
              ))}
            </div>
          </div>

          {isPickup && (
            <div>
              <label className="block text-sm font-bold text-charcoal mb-1">Pickup Station</label>
              {pickupStations.length === 0 ? (
                <div className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
                  No pickup stations available in {form.state}. Choose Home Delivery instead.
                </div>
              ) : (
                <select value={selectedStationId} onChange={(e) => setSelectedStationId(e.target.value)}
                  className="h-10 w-full rounded border border-border px-3 text-sm bg-white">
                  {pickupStations.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} — {s.address}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          <label className="flex items-start gap-2 pt-2 cursor-pointer">
            <input type="checkbox" checked={policyAccepted}
              onChange={(e) => setPolicyAccepted(e.target.checked)}
              className="mt-1" />
            <span className="text-xs text-charcoal">
              I accept the <Link href="/policies/shipping" target="_blank" className="text-primary underline font-bold">Shipping & Delivery Policy</Link>.
            </span>
          </label>

          {submitError && (
            <div className="rounded border border-danger/30 bg-danger/10 p-3 text-sm text-danger">{submitError}</div>
          )}

          <button type="submit" disabled={submitting || isCalculating || !!shippingError || (isPickup && pickupStations.length === 0)}
            className="w-full h-12 rounded bg-primary text-white font-bold text-sm hover:bg-primary-hover disabled:opacity-50">
            {submitting ? "Processing..." : `Pay ${formatNairaShort(totalKobo)}`}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-white p-5">
          <h2 className="font-bold text-charcoal mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="font-medium">{formatNairaShort(subtotalKobo)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Shipping</span>
              {isCalculating ? <span className="text-xs text-muted">Calculating...</span>
                : shippingError ? <span className="text-xs text-danger">{shippingError}</span>
                : <span className="font-medium">{formatNairaShort(shippingFeeKobo)}</span>}
            </div>
            <div className="pt-2 border-t border-border flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">{formatNairaShort(totalKobo)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}