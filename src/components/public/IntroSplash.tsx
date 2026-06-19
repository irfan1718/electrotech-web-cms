"use client";

import { useState, useEffect, useRef } from "react";
import clsx from "clsx";

interface IntroSplashProps {
  children: React.ReactNode;
}

export default function IntroSplash({ children }: IntroSplashProps) {
  const [phase, setPhase] = useState<"intro" | "exit" | "done">("intro");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    // Check if already shown this session
    const shown = sessionStorage.getItem("intro-shown");
    if (shown) {
      setPhase("done");
      return;
    }

    // Fallback timer — if video doesn't play within 3s, skip to logo animation
    const fallbackTimer = setTimeout(() => {
      if (phase === "intro") {
        startExit();
      }
    }, 6000); // Max 6 seconds for intro

    return () => clearTimeout(fallbackTimer);
  }, []);

  const startExit = () => {
    setPhase("exit");
    sessionStorage.setItem("intro-shown", "true");
    setTimeout(() => setPhase("done"), 1000);
  };

  const handleVideoEnd = () => {
    startExit();
  };

  const handleVideoError = () => {
    setVideoFailed(true);
    // Show logo animation for 2.5s then exit
    setTimeout(() => startExit(), 2500);
  };

  // Skip on click
  const handleSkip = () => {
    startExit();
  };

  if (phase === "done") return <>{children}</>;

  return (
    <>
      {/* Intro overlay */}
      <div
        className={clsx(
          "fixed inset-0 z-[100] flex items-center justify-center bg-[#080808] transition-all duration-1000",
          phase === "exit" ? "opacity-0 scale-105" : "opacity-100 scale-100",
        )}
        onClick={handleSkip}
      >
        {/* Intro video */}
        {!videoFailed && (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            onError={handleVideoError}
            className={clsx(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
              videoFailed ? "opacity-0" : "opacity-100",
            )}
          >
            <source src="/videos/intro-video.mp4" type="video/mp4" />
          </video>
        )}

        {/* Fallback — Logo animation (shown if video fails or as default) */}
        {videoFailed && (
          <div className="relative flex flex-col items-center gap-6 animate-in">
            {/* Logo */}
            <div className="relative">
              {/* Pulsing ring */}
              <div
                className="absolute inset-0 animate-ping rounded-full border border-[#C0152A]/20"
                style={{ animationDuration: "2s" }}
              />

              <svg
                viewBox="0 0 200 170"
                className="h-28 w-32 animate-[logoFade_1s_ease_forwards]"
              >
                <ellipse
                  cx="100"
                  cy="85"
                  rx="92"
                  ry="75"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="5"
                />
                <ellipse
                  cx="100"
                  cy="85"
                  rx="78"
                  ry="62"
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="2"
                />
                <path
                  d="M116 12L70 78 95 78 56 130 88 130 38 168 130 88 100 88 132 50 105 50 138 18Z"
                  fill="#C0152A"
                />
              </svg>
            </div>

            {/* Brand name */}
            <div className="animate-[fadeUp_0.8s_ease_0.3s_forwards] opacity-0">
              <p className="text-center text-3xl font-extrabold tracking-wide text-white">
                ELECTRO<span className="text-[#C0152A]">TECH</span>
              </p>
              <p className="mt-2 text-center text-[11px] uppercase tracking-[0.25em] text-white/30">
                Electromechanical Contracting LLC
              </p>
            </div>

            {/* Loading bar */}
            <div className="mt-4 h-[2px] w-48 overflow-hidden rounded-full bg-white/10">
              <div className="h-full animate-[loadBar_2.5s_ease_forwards] rounded-full bg-[#C0152A]" />
            </div>
          </div>
        )}

        {/* Skip hint */}
        <button
          onClick={handleSkip}
          className="absolute bottom-8 right-8 text-[12px] font-medium uppercase tracking-wider text-white/30 transition hover:text-white/60"
        >
          Skip →
        </button>

        <style>{`
          @keyframes logoFade {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes loadBar {
            from { width: 0%; }
            to { width: 100%; }
          }
          .animate-in {
            animation: fadeUp 0.6s ease forwards;
          }
        `}</style>
      </div>

      {/* Page content — hidden during intro */}
      <div
        className={clsx(
          "transition-opacity duration-500",
          phase === "exit" ? "opacity-100" : "opacity-0",
        )}
      >
        {children}
      </div>
    </>
  );
}
