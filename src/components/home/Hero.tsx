import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
export function Hero() {
  return (
    <section className="bg-white"><div className="mx-auto max-w-[1440px] px-4 pt-4 md:pt-6"><div className="grid md:grid-cols-2 rounded-section overflow-hidden border border-border">
      <div className="bg-cream p-6 md:p-10 lg:p-14 flex flex-col justify-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-charcoal leading-[1.1] tracking-tight">Everything You Need<br />In One Place</h1>
        <p className="mt-4 text-sm md:text-base text-charcoal/70 max-w-md">Shop from multiple categories, top brands and trusted sellers across Nigeria.</p>
        <div className="mt-6"><Link href="/category/electronics" className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors">Shop Now <ArrowRight size={16} /></Link></div>
      </div>
      <div className="relative bg-primary min-h-[280px] md:min-h-[380px] lg:min-h-[420px] overflow-hidden">
        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10" /><div className="absolute bottom-8 left-4 h-40 w-40 rounded-full bg-white/10" /><div className="absolute top-1/3 right-1/4 h-20 w-20 rounded-full bg-white/15" />
        <div className="absolute inset-0 flex items-center justify-center"><div className="relative w-full h-full max-w-[520px] max-h-[400px]">
          <div className="absolute top-[12%] left-[8%] w-[55%] aspect-[4/3] -rotate-6"><Image src="/images/placeholder.svg" alt="" fill sizes="280px" className="object-contain drop-shadow-xl" /></div>
          <div className="absolute top-[30%] right-[6%] w-[26%] aspect-[3/5] rotate-[8deg]"><Image src="/images/placeholder.svg" alt="" fill sizes="140px" className="object-contain drop-shadow-xl" /></div>
          <div className="absolute bottom-[6%] left-[26%] w-[34%] aspect-square rotate-[5deg]"><Image src="/images/placeholder.svg" alt="" fill sizes="180px" className="object-contain drop-shadow-xl" /></div>
          <div className="absolute bottom-[10%] right-[4%] w-[26%] aspect-[5/4] -rotate-[6deg]"><Image src="/images/placeholder.svg" alt="" fill sizes="140px" className="object-contain drop-shadow-xl" /></div>
        </div></div>
      </div>
    </div></div></section>
  );
}