"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import clsx from "clsx";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  description?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Upload Image",
  description = "JPG, PNG, WebP — Max 5MB",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
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

        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }

        onChange(data.data.url);
      } catch (err: any) {
        setError(err.message || "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // Reset input so same file can be selected again
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleRemove = async () => {
    if (value) {
      // Delete from server
      try {
        await fetch("/api/upload/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: value }),
        });
      } catch {
        // Ignore delete errors — file might already be gone
      }
    }
    onChange(null);
  };

  /* ── HAS IMAGE ── */
  if (value) {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            {label}
          </label>
        )}
        <div className="group relative inline-block">
          <img
            src={value}
            alt="Upload preview"
            className="h-36 w-52 rounded-xl border border-neutral-200 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-lg transition group-hover:opacity-100 hover:bg-red-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  /* ── UPLOAD AREA ── */
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
          {label}
        </label>
      )}

      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={clsx(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 transition-all",
          dragOver
            ? "border-[#c0152a] bg-red-50"
            : "border-neutral-200 bg-neutral-50 hover:border-neutral-300 hover:bg-neutral-100",
          uploading && "pointer-events-none opacity-60",
        )}
      >
        {uploading ? (
          <Loader2 className="mb-3 h-8 w-8 animate-spin text-[#c0152a]" />
        ) : (
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <Upload className="h-5 w-5 text-[#c0152a]" />
          </div>
        )}

        <p className="text-sm font-medium text-neutral-700">
          {uploading ? "Uploading..." : "Click to upload or drag & drop"}
        </p>
        <p className="mt-1 text-xs text-neutral-400">{description}</p>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
