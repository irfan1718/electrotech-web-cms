"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";

export default function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reset on route change complete
    setProgress(100);
    const timer = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Intercept link clicks to show loader
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("http") ||
        target.getAttribute("target") === "_blank"
      )
        return;

      // Same page check
      if (href === pathname) return;

      setLoading(true);
      setProgress(20);

      // Simulate progress
      const t1 = setTimeout(() => setProgress(50), 100);
      const t2 = setTimeout(() => setProgress(70), 300);
      const t3 = setTimeout(() => setProgress(85), 600);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[200] h-[3px]">
      <div
        className={clsx(
          "h-full bg-[#C0152A] transition-all",
          progress === 100 ? "duration-200" : "duration-500 ease-out",
        )}
        style={{ width: `${progress}%` }}
      />
      {loading && (
        <div className="absolute right-0 top-0 h-full w-24 animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      )}
    </div>
  );
}
