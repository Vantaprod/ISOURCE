"use client";
import { useRef, useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  name: string;               // The form field name (e.g., "imageFile")
  label: string;              // e.g., "Collection Cover"
  initialUrl?: string | null; // Existing image URL to preview
  aspectRatio?: "video" | "square" | "banner";
  required?: boolean;
  hint?: string;
}

export function ImageUploader({
  name,
  label,
  initialUrl,
  aspectRatio = "video",
  required = false,
  hint,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(initialUrl || null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectClass =
    aspectRatio === "square" ? "aspect-square" :
    aspectRatio === "banner" ? "aspect-[1920/600]" :
    "aspect-video";

  const maxSizeMB = 5;
  const acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

  const handleFile = useCallback((file: File) => {
    setError(null);
    if (!acceptedTypes.includes(file.type)) {
      setError("Please use JPG, PNG, or WebP.");
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image must be smaller than ${maxSizeMB}MB.`);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFileName(file.name);
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
      // Sync with the hidden file input
      const dt = new DataTransfer();
      dt.items.add(file);
      if (inputRef.current) inputRef.current.files = dt.files;
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleRemove() {
    setPreview(null);
    setFileName(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <label className="block text-sm font-bold text-charcoal mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Hidden actual file input — carries the data to FormData */}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={acceptedTypes.join(",")}
        required={required && !initialUrl}
        onChange={handleInputChange}
        className="sr-only"
      />

      {preview ? (
        // ── Preview mode ──
        <div className="relative">
          <div className={`relative w-full ${aspectClass} rounded-lg overflow-hidden border-2 border-border bg-surface`}>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="animate-spin text-white" size={32} />
              </div>
            )}
          </div>
          {fileName && (
            <p className="text-xs text-muted mt-2 truncate">📎 {fileName}</p>
          )}
          <div className="flex items-center gap-2 mt-3">
            <button type="button" onClick={() => inputRef.current?.click()} className="h-9 px-4 rounded-md border border-border text-sm font-bold hover:bg-surface">
              Replace
            </button>
            <button type="button" onClick={handleRemove} className="h-9 px-3 rounded-md border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 flex items-center gap-1">
              <X size={14} /> Remove
            </button>
          </div>
        </div>
      ) : (
        // ── Upload mode ──
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`w-full ${aspectClass} rounded-lg border-2 border-dashed transition-colors flex flex-col items-center justify-center p-6 text-center ${
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary hover:bg-surface"
          }`}
        >
          <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-3 ${isDragging ? "bg-primary text-white" : "bg-surface text-muted"}`}>
            <Upload size={24} />
          </div>
          <p className="text-sm font-bold text-charcoal mb-1">
            {isDragging ? "Drop to upload" : "Click or drag image here"}
          </p>
          <p className="text-xs text-muted">
            JPG, PNG, WebP — max {maxSizeMB}MB
          </p>
        </button>
      )}

      {hint && !error && <p className="text-xs text-muted mt-2">{hint}</p>}
      {error && (
        <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}