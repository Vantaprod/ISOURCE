"use client";
import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { updateBrandDetails } from "../../actions";
import { CheckCircle2, UploadCloud, X } from "lucide-react";
import type { Brand } from "@prisma/client";

export function EditBrandForm({ brand }: { brand: Brand }) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState<string | null>(brand.logoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }

  function clearFile() {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => { 
      await updateBrandDetails(brand.id, fd); 
      setSaved(true); 
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-6 space-y-6">
      {saved && (
        <p className="text-sm text-success bg-success/5 p-3 rounded border border-success/20 flex items-center gap-2">
          <CheckCircle2 size={16}/> Brand updated successfully.
        </p>
      )}
      
      <div>
        <label className="block text-sm font-bold text-charcoal mb-2">Brand Logo</label>
        
        <div 
          className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-surface/50 ${preview ? 'border-primary/50' : 'border-border'}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            name="logoFile" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
          <input type="hidden" name="existingLogoUrl" value={brand.logoUrl || ""} />
          
          {preview ? (
            <div className="relative group w-full flex justify-center">
              <div className="relative h-24 w-48 bg-white rounded flex items-center justify-center overflow-hidden border border-border">
                <Image src={preview} alt="Preview" fill sizes="192px" className="object-contain p-2" />
              </div>
              <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); clearFile(); }} 
                className="absolute top-0 right-1/4 bg-danger text-white rounded-full p-1 shadow-md hover:bg-danger/90"
                title="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <UploadCloud size={24} className="text-primary" />
              </div>
              <p className="text-sm font-medium text-charcoal">Click to upload or drag and drop</p>
              <p className="text-xs text-muted mt-1">SVG, PNG, JPG or WEBP (max. 5MB)</p>
            </>
          )}
        </div>
        <p className="text-xs text-muted mt-2">If no logo is uploaded, the brand name will be displayed as text.</p>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-lg bg-surface border border-border">
        <input type="checkbox" name="isFeatured" id="isFeatured" defaultChecked={brand.isFeatured} className="h-5 w-5 rounded border-border text-primary focus:ring-primary" />
        <div>
          <label htmlFor="isFeatured" className="text-sm font-bold text-charcoal cursor-pointer">Feature this brand on the homepage</label>
          <p className="text-xs text-muted">{"This will display the brand in the \"Featured Brand Stores\" section."}</p>
        </div>
      </div>

      <div className="pt-4 border-t border-border flex justify-end">
        <button type="submit" disabled={isPending} className="h-10 px-6 rounded bg-primary text-white text-sm font-bold hover:bg-primary-hover disabled:opacity-50 flex items-center gap-2">
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}