"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import clsx from "clsx";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  label?: string;
}

export default function MultiImageUpload({
  value = [],
  onChange,
  max = 4,
  label = "Gallery Images",
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (value.length >= max) {
      setError(`Maximum ${max} images allowed`);
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      onChange([...value, data.data.url]);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = async (index: number) => {
    const url = value[index];

    // Delete from server
    try {
      await fetch("/api/upload/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
    } catch {
      // Ignore
    }

    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  const remaining = max - value.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
          {label}
        </label>
        <span className="text-xs text-neutral-400">
          {value.length} / {max}
        </span>
      </div>

      {/* Image previews */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {value.map((url, index) => (
            <div key={index} className="group relative">
              <img
                src={url}
                alt={`Gallery ${index + 1}`}
                className="h-28 w-28 rounded-xl border border-neutral-200 object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-lg transition group-hover:opacity-100 hover:bg-red-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <span className="absolute bottom-1.5 left-1.5 flex h-5 min-w-[20px] items-center justify-center rounded bg-black/60 px-1 text-[10px] font-bold text-white">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {remaining > 0 && (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          className={clsx(
            "flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-4 transition-all",
            uploading
              ? "pointer-events-none border-neutral-200 bg-neutral-50 opacity-60"
              : "border-neutral-200 bg-neutral-50 hover:border-neutral-300 hover:bg-neutral-100",
          )}
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-[#c0152a]" />
          ) : (
            <Upload className="h-5 w-5 text-neutral-400" />
          )}
          <span className="text-sm text-neutral-500">
            {uploading ? "Uploading..." : `Add image (${remaining} remaining)`}
          </span>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
