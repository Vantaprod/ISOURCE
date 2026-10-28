import { ShieldCheck, Truck, Users, Sun } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 md:py-16">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-charcoal mb-4">About Isource</h1>
        <p className="text-base md:text-lg text-muted leading-relaxed">
          More Choices. Better Living. We are Nigeria&apos;s multi-vendor marketplace connecting you with trusted sellers across electronics, home, solar, fashion, and more.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
        <div className="bg-cream rounded-xl p-8 md:p-10">
          <h2 className="text-xl md:text-2xl font-bold text-charcoal mb-3">Our Mission</h2>
          <p className="text-sm text-charcoal/80 leading-relaxed">
            To simplify online shopping for Nigerians by providing a single, secure platform where quality products from verified vendors are accessible to everyone, everywhere.
          </p>
        </div>
        <div className="bg-white border border-border rounded-xl p-8 md:p-10">
          <h2 className="text-xl md:text-2xl font-bold text-charcoal mb-3">Our Vision</h2>
          <p className="text-sm text-charcoal/80 leading-relaxed">
            To become the most trusted e-commerce ecosystem in Africa, empowering local businesses to grow while delivering exceptional value and convenience to our customers.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {[
          { icon: ShieldCheck, title: "Trusted Sellers", desc: "Vetted and verified vendors" },
          { icon: Truck, title: "Fast Delivery", desc: "Across Lagos, Abuja & PH" },
          { icon: Users, title: "Customer First", desc: "7-day easy returns" },
          { icon: Sun, title: "Solar & Power", desc: "Specialized in off-grid essentials" }
        ].map((item) => (
          <div key={item.title} className="p-6 rounded-lg border border-border bg-white">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <item.icon size={24} />
            </div>
            <h3 className="font-semibold text-charcoal mb-1">{item.title}</h3>
            <p className="text-xs text-muted">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}