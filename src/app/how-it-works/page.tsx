import Link from "next/link";

export const metadata = { title: "How Isource Works — Isource" };

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-2xl text-center min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-extrabold text-charcoal mb-4">How Isource Works</h1>
      <p className="text-lg text-muted mb-8">Learn how our marketplace connects buyers with trusted local vendors.</p>
      <div className="p-6 bg-surface border border-border rounded-xl w-full mb-8">
        <p className="text-charcoal font-medium">We are currently building this page. Please check back soon!</p>
      </div>
      <Link href="/" className="h-11 px-8 rounded-lg bg-primary text-white font-bold flex items-center hover:bg-primary-hover transition-colors">
        Return to Homepage
      </Link>
    </div>
  );
}