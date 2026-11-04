import Link from "next/link";

export default function AdvertisingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-extrabold text-charcoal mb-6">Isource Advertising Policy</h1>
      <div className="prose prose-sm md:prose-base text-charcoal">
        <p className="text-muted mb-4">Version 1.0 | Effective Date: To be announced</p>
        {/* PASTE YOUR FULL POLICY CONTENT HERE */}
        <p><strong>1. INTRODUCTION</strong></p>
        <p>Isource provides advertising and promotional services...</p>
        <p>[Paste the rest of the text here]</p>
      </div>
      <div className="mt-8 pt-6 border-t border-border">
        <Link href="/vendor/advertising/create" className="text-primary font-bold hover:underline">
          ← Back to Campaign Creation
        </Link>
      </div>
    </div>
  );
}