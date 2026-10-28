import { Truck, MapPin, Clock, PackageCheck } from "lucide-react";

export default function DeliveryPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-charcoal mb-4">Delivery Information</h1>
        <p className="text-muted mb-8">Everything you need to know about how your orders get to you.</p>

        <div className="space-y-6">
          <div className="flex gap-4 p-5 rounded-lg border border-border bg-white">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg mb-1">Delivery Times</h2>
              <ul className="list-disc list-inside text-sm text-charcoal/80 space-y-1">
                <li><strong>Lagos, Abuja, Port Harcourt:</strong> 1–3 working days</li>
                <li><strong>Other states:</strong> 3–7 working days</li>
                <li><strong>Express Delivery:</strong> Same-day or next-day (selected cities)</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4 p-5 rounded-lg border border-border bg-white">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg mb-1">Delivery Fees</h2>
              <ul className="list-disc list-inside text-sm text-charcoal/80 space-y-1">
                <li><strong>Home Delivery:</strong> ₦2,500 (Free on orders over ₦50,000)</li>
                <li><strong>Pickup Station:</strong> ₦1,000</li>
                <li><strong>Express Delivery:</strong> ₦5,000</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4 p-5 rounded-lg border border-border bg-white">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <PackageCheck size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg mb-1">Pay on Delivery</h2>
              <p className="text-sm text-charcoal/80">
                Available in Lagos, Abuja, and Port Harcourt for eligible items. You can pay with cash or POS upon arrival.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 rounded-lg border border-border bg-white">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg mb-1">Order Tracking</h2>
              <p className="text-sm text-charcoal/80">
                Once your order is dispatched, you will receive a tracking reference via SMS and email to monitor its progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}