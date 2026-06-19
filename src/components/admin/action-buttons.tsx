"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import clsx from "clsx";

interface ActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ActionButtons({
  onView,
  onEdit,
  onDelete,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      {onView && (
        <button
          onClick={onView}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
          title="View"
        >
          <Eye className="h-3.5 w-3.5" />
        </button>
      )}

      {onEdit && (
        <button
          onClick={onEdit}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
          title="Edit"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      )}

      {onDelete && (
        <button
          onClick={onDelete}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 transition hover:border-red-200 hover:bg-red-50 hover:text-[#c0152a]"
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
