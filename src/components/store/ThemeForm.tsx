"use client";
import { useActionState } from "react";
import { updateStoreTheme } from "@/app/actions/store-sections";
import { CheckCircle2, Loader2, Save, Palette } from "lucide-react";

interface Props {
  initialTheme: { accentColor: string; backgroundColor: string; buttonStyle: string } | null;
}

export function ThemeForm({ initialTheme }: Props) {
  const [state, formAction, isPending] = useActionState(updateStoreTheme, null);
  const theme = initialTheme || { accentColor: "#F58220", backgroundColor: "#FFFFFF", buttonStyle: "rounded-lg" };

  return (
    <form action={formAction} className="space-y-5 bg-white rounded-xl border border-border p-6">
      {state?.error && <div className="p-3 bg-red-50 text-red-600 rounded text-sm">{state.error}</div>}
      {state?.success && (
        <div className="p-3 bg-green-50 text-green-700 rounded text-sm flex items-center gap-2">
          <CheckCircle2 size={16} /> Theme saved!
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-bold text-charcoal mb-2 flex items-center gap-2">
            <Palette size={16} /> Accent Color
          </label>
          <div className="flex gap-2">
            <input name="accentColor" type="color" defaultValue={theme.accentColor}
              className="h-10 w-14 rounded border border-border cursor-pointer" />
            <input defaultValue={theme.accentColor} readOnly
              className="flex-1 h-10 rounded border border-border px-3 text-sm font-mono" />
          </div>
          <p className="text-xs text-muted mt-1">Used for buttons and links on your store.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-charcoal mb-2">Background Color</label>
          <div className="flex gap-2">
            <input name="backgroundColor" type="color" defaultValue={theme.backgroundColor}
              className="h-10 w-14 rounded border border-border cursor-pointer" />
            <input defaultValue={theme.backgroundColor} readOnly
              className="flex-1 h-10 rounded border border-border px-3 text-sm font-mono" />
          </div>
          <p className="text-xs text-muted mt-1">Page background for your storefront.</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-charcoal mb-2">Button Style</label>
        <select name="buttonStyle" defaultValue={theme.buttonStyle}
          className="w-full h-10 rounded border border-border px-3 text-sm outline-none focus:border-primary bg-white">
          <option value="rounded-none">Square (Sharp)</option>
          <option value="rounded-md">Soft Corners</option>
          <option value="rounded-lg">Standard (Default)</option>
          <option value="rounded-xl">Very Rounded</option>
          <option value="rounded-full">Pill (Full Round)</option>
        </select>
      </div>

      <button type="submit" disabled={isPending} className="h-11 px-8 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary-hover disabled:opacity-50 flex items-center gap-2">
        {isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
        {isPending ? "Saving..." : "Save Theme"}
      </button>
    </form>
  );
}