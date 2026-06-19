"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function PageTransition() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={clsx(
        "pointer-events-none fixed inset-0 z-[150] flex items-center justify-center bg-white transition-opacity duration-300",
        isLoading ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-neutral-200 border-t-[#C0152A]" />
        </div>
      </div>
    </div>
  );
}
