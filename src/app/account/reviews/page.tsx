import { PackageX } from "lucide-react";

export default function PlaceholderPage() {
  return (
    <div className="rounded-xl border border-border bg-white p-12 text-center">
      <PackageX size={40} className="mx-auto text-muted mb-4" />
      <h2 className="text-lg font-bold text-charcoal mb-2">Coming Soon</h2>
      <p className="text-sm text-muted">This section is currently under development and will be available soon.</p>
    </div>
  );
}