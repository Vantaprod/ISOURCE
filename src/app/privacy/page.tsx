import Link from "next/link";

export const metadata = { title: "Privacy Policy — Isource" };

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-extrabold text-charcoal mb-2">Privacy Policy</h1>
      <p className="text-xs text-muted mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

      <article className="prose prose-sm md:prose-base text-charcoal space-y-6">
        <section>
          <h2 className="text-lg font-bold">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, and payment information.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold">2. How We Use Information</h2>
          <p>We use the information we collect to fulfill your orders, communicate with you about products, services, and promotional offers, and to personalize and improve your experience on Isource.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold">3. Sharing of Information</h2>
          <p>We may share your information with vendors to fulfill your orders, with payment processors to handle transactions, and with third-party service providers who perform services on our behalf (like delivery partners).</p>
        </section>

        <section>
          <h2 className="text-lg font-bold">4. Security</h2>
          <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. All payments are encrypted and processed securely.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold">5. Your Choices</h2>
          <p>You may update, correct, or delete your account information at any time by logging into your online account. You can also opt-out of receiving promotional emails from us by following the instructions in those emails.</p>
        </section>
      </article>

      <div className="mt-12 pt-6 border-t border-border">
        <Link href="/" className="text-primary font-bold hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
}