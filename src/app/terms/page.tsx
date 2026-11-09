import Link from "next/link";

export const metadata = { title: "Terms & Conditions — Isource" };

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-extrabold text-charcoal mb-2">Terms & Conditions</h1>
      <p className="text-xs text-muted mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

      <article className="prose prose-sm md:prose-base text-charcoal space-y-6">
        <section>
          <h2 className="text-lg font-bold">1. Introduction</h2>
          <p>Welcome to Isource Marketplace. By accessing or using our platform, you agree to be bound by these Terms & Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold">2. User Accounts</h2>
          <p>When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold">3. Vendor Responsibilities</h2>
          <p>Vendors are solely responsible for the products they list, the accuracy of product descriptions, and the fulfilment of orders. Isource acts as a platform connecting buyers and sellers and is not the manufacturer or direct seller of the products.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold">4. Payments and Fees</h2>
          <p>All payments are processed securely via our payment partners. Isource deducts a commission on sales as agreed upon during vendor onboarding. Shipping fees are calculated based on the shipping policy.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold">5. Returns and Refunds</h2>
          <p>Returns and refunds are governed by our Returns Policy. Buyers must initiate return requests within the specified timeframe. Refunds will be processed to the original payment method.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold">6. Limitation of Liability</h2>
          <p>In no event shall Isource, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the Service.</p>
        </section>
      </article>

      <div className="mt-12 pt-6 border-t border-border">
        <Link href="/" className="text-primary font-bold hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
}