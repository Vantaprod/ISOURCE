import { CheckCircle2, XCircle } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-charcoal mb-4">Returns & Refunds</h1>
        <p className="text-muted mb-8">Hassle-free returns within 7 days of delivery.</p>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 rounded-lg border border-success/30 bg-success/5">
            <h2 className="font-bold text-lg mb-2 flex items-center gap-2 text-success">
              <CheckCircle2 size={20} /> Eligible for Return
            </h2>
            <ul className="list-disc list-inside text-sm text-charcoal/80 space-y-1">
              <li>Item is damaged or defective upon arrival.</li>
              <li>Item is significantly different from the description.</li>
              <li>Wrong item was delivered.</li>
              <li>Original packaging and tags are intact.</li>
            </ul>
          </div>
          <div className="p-6 rounded-lg border border-danger/30 bg-danger/5">
            <h2 className="font-bold text-lg mb-2 flex items-center gap-2 text-danger">
              <XCircle size={20} /> Not Eligible
            </h2>
            <ul className="list-disc list-inside text-sm text-charcoal/80 space-y-1">
              <li>Groceries, perishables, and personal care items.</li>
              <li>Items worn, washed, or altered.</li>
              <li>Returns requested after 7 days.</li>
              <li>Free gifts or promotional items.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-white p-6 space-y-6">
          <h2 className="text-xl font-bold text-charcoal">How to Return an Item</h2>
          <div className="flex gap-4">
            <div className="h-8 w-8 rounded-full bg-primary text-white font-bold flex items-center justify-center flex-shrink-0">1</div>
            <div>
              <h3 className="font-semibold text-charcoal">Request a Return</h3>
              <p className="text-sm text-muted">Go to your Account → Orders and click &quot;Request Return&quot; next to the item.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="h-8 w-8 rounded-full bg-primary text-white font-bold flex items-center justify-center flex-shrink-0">2</div>
            <div>
              <h3 className="font-semibold text-charcoal">Pack the Item</h3>
              <p className="text-sm text-muted">Place the item in its original packaging with all accessories and tags.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="h-8 w-8 rounded-full bg-primary text-white font-bold flex items-center justify-center flex-shrink-0">3</div>
            <div>
              <h3 className="font-semibold text-charcoal">Schedule Pickup</h3>
              <p className="text-sm text-muted">Our courier will pick up the item from your address within 48 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}