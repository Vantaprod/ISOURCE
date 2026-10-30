import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function PromoBanners() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-6">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Solar Bundles */}
        <div className="relative rounded-xl overflow-hidden bg-charcoal text-white flex items-center min-h-[180px]">
          <div className="p-6 md:p-8 relative z-10 md:w-3/4">
            <h3 className="text-2xl font-bold mb-2">Solar Bundle Deals</h3>
            <p className="text-sm text-white/80 mb-4">Complete solar kits for homes and businesses. Save more when you buy together.</p>
            <Link href="/category/solar-power?q=bundle" className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover">
              Explore Bundles <ArrowRight size={14} />
            </Link>
          </div>
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-40">
             <Image src="/images/placeholder.svg" alt="House" fill className="object-cover" />
          </div>
        </div>

        {/* Need Help Choosing */}
        <div className="relative rounded-xl overflow-hidden bg-[#FDF6ED] flex items-center min-h-[180px]">
          <div className="p-6 md:p-8 relative z-10 md:w-3/4">
            <h3 className="text-2xl font-bold text-[#D97706] mb-2">Need Help Choosing?</h3>
            <p className="text-sm text-charcoal/70 mb-4">Our experts are here to guide you.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover">
              Talk to Us <ArrowRight size={14} />
            </Link>
          </div>
          <div className="absolute right-0 bottom-0 w-1/3 h-full opacity-30">
             <Image src="/images/placeholder.svg" alt="Expert" fill className="object-cover object-top" />
          </div>
        </div>
      </div>
    </section>
  );
}