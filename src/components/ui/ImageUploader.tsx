"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  name: string;
  maxImages?: number;
}

export function ImageUploader({ name, maxImages = 12 }: ImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    
    const validFiles = Array.from(newFiles).filter(f => f.type.startsWith("image/"));
    if (validFiles.length === 0) return;

    // Combine existing and new, slice to max
    const combined = [...files, ...validFiles].slice(0, maxImages);
    setFiles(combined);

    // Generate previews
    const newPreviews = combined.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
    
    // Reset input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      {/* Hidden actual file input used by the form action */}
      <input
        type="file"
        name={name}
        multiple
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
          {previews.map((preview, i) => (
            <div key={i} className="relative aspect-square rounded-lg border border-border overflow-hidden group">
              <img src={preview} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropzone */}
      {files.length < maxImages && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={onDragOver}
          onDrop={onDrop}
          className="border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors rounded-xl p-8 text-center cursor-pointer flex flex-col items-center justify-center"
        >
          <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mb-3">
            <UploadCloud className="text-muted" size={24} />
          </div>
          <p className="text-sm font-bold text-charcoal">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-muted mt-1">
            PNG, JPG or WEBP (max {maxImages} images)
          </p>
          <p className="text-xs text-primary font-bold mt-2">
            {files.length} / {maxImages} uploaded
          </p>
        </div>
      )}
    </div>
  );
}