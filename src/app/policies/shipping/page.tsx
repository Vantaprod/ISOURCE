import Link from "next/link";

export const metadata = { title: "Shipping & Delivery Policy — Isource" };

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-extrabold text-charcoal mb-2">Shipping & Delivery Policy</h1>
      <p className="text-xs text-muted mb-8">Version 1.0 · Effective on deployment</p>

      <article className="prose prose-sm md:prose-base text-charcoal space-y-4">
        <h2 className="text-lg font-bold">1. Default Payer</h2>
        <p>Shipping is paid by the customer by default. Sellers or Isource may fund shipping discounts as clearly labelled promotional exceptions.</p>

        <h2 className="text-lg font-bold">2. Delivery Methods</h2>
        <p>Isource supports <strong>Home Delivery</strong> and <strong>Pickup Station</strong>. Options are shown only when available for your destination.</p>

        <h2 className="text-lg font-bold">3. Multi-Vendor Orders</h2>
        <p>Orders from multiple sellers split into separate shipments. Each shipment has its own tracking number and delivery timeline. Combined shipping fees are shown at checkout.</p>

        <h2 className="text-lg font-bold">4. Shipping Charges</h2>
        <p>Shipping fees are calculated server-side per shipment based on weight, dimensions, delivery zone, and provider rates. Fees are not stored from the browser.</p>

        <h2 className="text-lg font-bold">5. Delivery Estimates</h2>
        <p>Delivery times shown on order placement are estimates, not guarantees. Confirmed shipping charges cannot be silently increased after payment.</p>

        <h2 className="text-lg font-bold">6. Returns</h2>
        <p>Return shipping follows the Isource Returns Policy. Return shipping is not automatically charged to the customer when the seller or Isource is responsible.</p>

        <h2 className="text-lg font-bold">7. Statutory Rights</h2>
        <p>Nothing in this policy limits your statutory consumer rights under Nigerian law.</p>
      </article>

      <div className="mt-12 pt-6 border-t border-border">
        <Link href="/checkout" className="text-primary font-bold hover:underline">← Back to Checkout</Link>
      </div>
    </div>
  );
}