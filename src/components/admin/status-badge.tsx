import clsx from "clsx";

const variants = {
  published: { bg: "bg-green-50", text: "text-green-600", dot: "bg-green-500" },
  draft: {
    bg: "bg-neutral-100",
    text: "text-neutral-500",
    dot: "bg-neutral-400",
  },
  open: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
  closed: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
  unread: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500" },
  read: {
    bg: "bg-neutral-100",
    text: "text-neutral-500",
    dot: "bg-neutral-400",
  },
  active: { bg: "bg-green-50", text: "text-green-600", dot: "bg-green-500" },
  // New project statuses
  awarded: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
  "in-progress": {
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-500",
  },
  completed: { bg: "bg-green-50", text: "text-green-600", dot: "bg-green-500" },
};

const displayLabels: Record<string, string> = {
  "in-progress": "In Progress",
  awarded: "Awarded",
  completed: "Completed",
};

interface StatusBadgeProps {
  status: keyof typeof variants;
  label?: string;
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const v = variants[status] || variants.draft;
  const displayLabel =
    label ||
    displayLabels[status] ||
    status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
        v.bg,
        v.text,
      )}
    >
      <span className={clsx("h-1.5 w-1.5 rounded-full", v.dot)} />
      {displayLabel}
    </span>
  );
}
