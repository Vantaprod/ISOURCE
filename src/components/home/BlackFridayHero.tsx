import Link from "next/link";

export function BlackFridayHero() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6">
      <div className="relative overflow-hidden rounded-2xl bg-[#111111] text-white p-8 md:p-16 flex flex-col md:flex-row items-center justify-between shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#FBAF3C 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="relative z-10 max-w-lg mb-8 md:mb-0">
          <div className="inline-block bg-[#FBAF3C] text-black font-extrabold text-sm px-3 py-1 rounded mb-4 uppercase tracking-wider">
            Limited Time Only
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            BLACK<br /><span className="text-[#FBAF3C]">FRIDAY</span>
          </h1>
          <p className="text-lg text-gray-300 mb-6">Huge discounts. Limited time. Up to 70% off.</p>
          <Link href="/search?q=deal" className="inline-flex h-12 items-center justify-center rounded-md bg-[#FBAF3C] px-8 text-sm font-bold text-black hover:bg-yellow-500 transition-colors">
            Shop Now →
          </Link>
        </div>

        {/* Hero Image Placeholder */}
        <div className="relative z-10 w-full md:w-[400px] h-[250px] md:h-[350px] bg-[#222] rounded-xl flex items-center justify-center border border-gray-700 shadow-xl">
           <span className="text-gray-500 text-sm">Black Friday Product Image</span>
        </div>
      </div>
    </div>
  );
}