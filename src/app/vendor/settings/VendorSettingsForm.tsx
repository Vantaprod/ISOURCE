"use client";
import { useActionState } from "react";
import { updateVendorSettings } from "@/app/actions/vendor";
import { Phone, CheckCircle2 } from "lucide-react";

export function VendorSettingsForm({ currentPhone }: { currentPhone: string }) {
  const [state, formAction, isPending] = useActionState(updateVendorSettings, null);

  return (
    <form action={formAction} className="space-y-6 rounded-xl border border-border bg-white p-6">
      {state?.error && <div className="p-3 bg-red-50 text-red-600 rounded text-sm">{state.error}</div>}
      {state?.success && (
        <div className="p-3 bg-green-50 text-green-700 rounded text-sm flex items-center gap-2">
          <CheckCircle2 size={16} /> Settings saved successfully!
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-charcoal mb-2">After-Sales / Emergency Phone *</label>
        <p className="text-xs text-muted mb-3">This number is displayed on your product pages so buyers can contact you for warranty claims.</p>
        <div className="relative">
          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input 
            name="afterSalesPhone" 
            defaultValue={currentPhone}
            required
            placeholder="e.g. 08012345678"
            className="h-11 w-full rounded-lg border border-border pl-10 pr-4 text-sm focus:border-primary outline-none" 
          />
        </div>
      </div>

      <button type="submit" disabled={isPending} className="h-11 px-8 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover disabled:opacity-50 transition-colors">
        {isPending ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}