import Link from "next/link";
import { PackageX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="h-20 w-20 rounded-full bg-surface flex items-center justify-center mb-6">
        <PackageX size={40} className="text-muted" />
      </div>
      <h1 className="text-3xl font-extrabold text-charcoal mb-2">Page not found</h1>
      <p className="text-muted mb-8 max-w-md">
        {"We couldn't find the page you're looking for. It may have been moved or deleted."}
      </p>
      <Link href="/" className="h-11 px-8 leading-[44px] rounded bg-primary text-white text-sm font-semibold hover:bg-primary-hover">
        Back to Homepage
      </Link>
    </div>
  );
}