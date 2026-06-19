"use client";

import { Trash2, X } from "lucide-react";

interface DeleteModalProps {
  open: boolean;
  title?: string;
  module?: string;
  loading?: boolean;

  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({
  open,
  title,
  module = "Item",
  loading = false,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Trash2 className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-black">Delete {module}</h2>

              <p className="text-sm text-neutral-500">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-400 transition hover:bg-neutral-100 hover:text-black disabled:pointer-events-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-6">
          <p className="text-sm leading-7 text-neutral-600">
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold text-black">{title || module}</span>?
          </p>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 border-t border-neutral-100 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-11 items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-black transition hover:bg-neutral-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex h-11 min-w-[120px] items-center justify-center rounded-2xl bg-[#c0152a] px-5 text-sm font-semibold text-white transition hover:bg-[#a31224] disabled:opacity-70"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
