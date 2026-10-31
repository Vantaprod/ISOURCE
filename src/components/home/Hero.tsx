import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Truck, ShieldCheck, RefreshCcw } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1440px] px-4 pt-4 md:pt-6">
        <div className="grid lg:grid-cols-[1fr_280px] gap-4">
          
          {/* Main Banner */}
          <div className="relative rounded-xl overflow-hidden bg-[#FDF6ED] flex flex-col md:flex-row items-center border border-border">
            <div className="p-8 md:p-12 md:w-1/2 z-10">
              <p className="text-primary font-bold text-sm mb-2 uppercase tracking-wide">Powering a Brighter Tomorrow</p>
              <h1 className="text-3xl md:text-5xl font-extrabold text-charcoal leading-[1.1] tracking-tight mb-4">Reliable Solar Solutions for Every Home & Business</h1>
              <p className="text-charcoal/70 mb-6">Premium solar panels, inverters, batteries and accessories from trusted brands.</p>
              <Link href="/category/solar-power" className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors">
                Shop Solar Now <ArrowRight size={16} />
              </Link>
            </div>
            <div className="relative md:w-1/2 h-[250px] md:h-[400px] w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FDF6ED] via-transparent to-transparent z-10 hidden md:block" />
              <div className="absolute top-0 right-0 w-[120%] h-full bg-primary rounded-l-[100px] transform translate-x-1/4 skew-x-[-15deg] z-0" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <Image src="/images/placeholder.svg" alt="Solar Products" fill sizes="50vw" className="object-contain p-8 drop-shadow-2xl" />
              </div>
            </div>
          </div>

          {/* Sidebar Trust Badges */}
          <div className="hidden lg:flex flex-col gap-3">
            <div className="flex-1 rounded-xl border border-border bg-white p-5 flex flex-col justify-center gap-6">
              <div className="flex gap-4 items-start">
                <CheckCircle2 className="text-primary flex-shrink-0" size={24} />
                <div><h3 className="font-bold text-sm text-charcoal">Genuine Products</h3><p className="text-xs text-muted mt-0.5">From verified sellers</p></div>
              </div>
              <div className="flex gap-4 items-start">
                <Truck className="text-primary flex-shrink-0" size={24} />
                <div><h3 className="font-bold text-sm text-charcoal">Fast Delivery</h3><p className="text-xs text-muted mt-0.5">Across Nigeria</p></div>
              </div>
              <div className="flex gap-4 items-start">
                <ShieldCheck className="text-primary flex-shrink-0" size={24} />
                <div><h3 className="font-bold text-sm text-charcoal">Secure Payments</h3><p className="text-xs text-muted mt-0.5">Paystack & Flutterwave</p></div>
              </div>
              <div className="flex gap-4 items-start">
                <RefreshCcw className="text-primary flex-shrink-0" size={24} />
                <div><h3 className="font-bold text-sm text-charcoal">Easy Returns</h3><p className="text-xs text-muted mt-0.5">Hassle-free</p></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}