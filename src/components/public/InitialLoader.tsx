"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";

export default function InitialLoader() {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Simulate progress
    const t1 = setTimeout(() => setProgress(30), 100);
    const t2 = setTimeout(() => setProgress(50), 400);
    const t3 = setTimeout(() => setProgress(70), 800);
    const t4 = setTimeout(() => setProgress(85), 1200);

    const onReady = () => {
      setProgress(100);
      setTimeout(() => setLoaded(true), 400);
    };

    if (document.readyState === "complete") {
      setTimeout(onReady, 500);
    } else {
      window.addEventListener("load", onReady);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener("load", onReady);
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      const timer = setTimeout(() => setHidden(true), 800);
      return () => clearTimeout(timer);
    }
  }, [loaded]);

  if (hidden) return null;

  return (
    <div
      className={clsx(
        "fixed inset-0 z-[300] flex items-center justify-center bg-[#080808] transition-all duration-700",
        loaded && "pointer-events-none opacity-0",
      )}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="relative">
          <div
            className="absolute -inset-4 animate-ping rounded-full border border-[#C0152A]/10"
            style={{ animationDuration: "2s" }}
          />
          <div
            className="absolute -inset-8 animate-ping rounded-full border border-[#C0152A]/5"
            style={{ animationDuration: "2.5s", animationDelay: "0.3s" }}
          />

          <Image
            src="/images/logo-electrotech.png"
            alt="Electrotech"
            width={70}
            height={70}
            className="relative z-10 h-auto w-[70px] object-contain"
            priority
          />
        </div>

        {/* Brand name */}
        <div className="text-center">
          <p className="text-xl font-extrabold tracking-wide text-white">
            ELECTRO<span className="text-[#C0152A]">TECH</span>
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/30">
            Electromechanical Contracting
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-2 w-52">
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#C0152A] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* <p className="mt-3 text-center text-[11px] font-medium tabular-nums text-white/30">
            {progress}%
          </p> */}
        </div>
      </div>
    </div>
  );
}
