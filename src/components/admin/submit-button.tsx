"use client";

import { Loader2 } from "lucide-react";
import clsx from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  onClick?: () => void;
  className?: string;
}

export default function Button({
  children,
  loading = false,
  disabled = false,
  type = "button",
  variant = "primary",
  onClick,
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      className={clsx(
        "flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",

        variant === "primary" && "bg-[#c0152a] text-white hover:bg-[#a31224]",

        variant === "secondary" &&
          "border border-neutral-200 bg-white text-black hover:bg-neutral-50",

        variant === "danger" && "bg-red-600 text-white hover:bg-red-700",

        className,
      )}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}
