import Link from "next/link";
import { Store, TrendingUp, ShieldCheck, Truck, ArrowRight } from "lucide-react";

export default function SellPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-charcoal text-white py-16 md:py-24 px-4">
        <div className="mx-auto max-w-[1440px] text-center max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Grow your business on Isource</h1>
          <p className="text-base md:text-lg text-white/80 mb-8">
            Reach millions of customers across Nigeria. Join a marketplace built for trusted vendors.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 h-12 px-8 rounded bg-primary text-white text-base font-semibold hover:bg-primary-hover transition-colors">
            Apply to Sell <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 md:py-24">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why sell on Isource?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Store, title: "Zero Setup Fees", desc: "Create your storefront for free and pay only when you sell." },
            { icon: TrendingUp, title: "Wide Reach", desc: "Access customers in Lagos, Abuja, PH, and beyond." },
            { icon: ShieldCheck, title: "Secure Payments", desc: "Guaranteed payouts through our escrow system." },
            { icon: Truck, title: "Logistics Support", desc: "Use our delivery network or ship with your own." }
          ].map((item) => (
            <div key={item.title} className="p-6 rounded-lg border border-border bg-white text-center hover:border-primary transition-colors">
              <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <item.icon size={28} />
              </div>
              <h3 className="font-bold text-charcoal mb-2">{item.title}</h3>
              <p className="text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="bg-surface py-16 md:py-24 px-4">
        <div className="mx-auto max-w-[1440px]">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Apply", desc: "Fill out the seller application form with your business details." },
              { step: "2", title: "Get Approved", desc: "Our team reviews your application within 48 hours." },
              { step: "3", title: "Start Selling", desc: "List your products, manage inventory, and receive orders." }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary text-white font-bold text-xl flex items-center justify-center mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}