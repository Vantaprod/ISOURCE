"use client";
import { useActionState } from "react";
import { createCollection, updateCollection } from "@/app/actions/store-collections";
import { CheckCircle2, Loader2, Save } from "lucide-react";
import { ImageUploader } from "@/components/ui/ImageUploader";

interface Props {
  mode: "create" | "edit";
  collectionId?: string;
  initialData?: { name: string; description: string | null; imageUrl: string | null };
}

export function CollectionForm({ mode, collectionId, initialData }: Props) {
  const boundAction = mode === "edit" && collectionId
    ? updateCollection.bind(null, collectionId)
    : createCollection;
  const [state, formAction, isPending] = useActionState(boundAction, null);

  return (
    <form action={formAction} className="space-y-5 bg-white rounded-xl border border-border p-6">
      {state?.error && <div className="p-3 bg-red-50 text-red-600 rounded text-sm">{state.error}</div>}
      {state?.success && (
        <div className="p-3 bg-green-50 text-green-700 rounded text-sm flex items-center gap-2">
          <CheckCircle2 size={16} /> Saved successfully!
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-charcoal mb-1">Collection Name *</label>
        <input name="name" required defaultValue={initialData?.name || ""} placeholder="e.g., Best Sellers"
          className="w-full h-10 rounded border border-border px-3 text-sm outline-none focus:border-primary" />
      </div>

      <div>
        <label className="block text-sm font-bold text-charcoal mb-1">Description (Optional)</label>
        <textarea name="description" rows={2} defaultValue={initialData?.description || ""}
          placeholder="Short description for this collection"
          className="w-full rounded border border-border p-3 text-sm outline-none focus:border-primary resize-none" />
      </div>

      <ImageUploader
        name="imageFile"
        label="Cover Image"
        initialUrl={initialData?.imageUrl || null}
        aspectRatio="video"
        hint="This image appears as the collection cover on your public storefront."
      />

      <button type="submit" disabled={isPending}
        className="h-11 px-8 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary-hover disabled:opacity-50 flex items-center gap-2">
        {isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
        {isPending ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Collection"}
      </button>
    </form>
  );
}