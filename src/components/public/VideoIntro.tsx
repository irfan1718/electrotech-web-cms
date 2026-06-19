"use client";

import { useState, useRef, useEffect } from "react";
import clsx from "clsx";

export default function VideoIntro() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const hasTriedPlay = useRef(false);

  // Scroll-based fade out
  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const sectionHeight = section.offsetHeight;
      const scrollY = window.scrollY;

      // Start fading at 20% scroll, fully gone at 80%
      const fadeStart = sectionHeight * 0.2;
      const fadeEnd = sectionHeight * 0.8;

      if (scrollY <= fadeStart) {
        setScrollOpacity(1);
      } else if (scrollY >= fadeEnd) {
        setScrollOpacity(0);
      } else {
        setScrollOpacity(1 - (scrollY - fadeStart) / (fadeEnd - fadeStart));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pause video when fully scrolled past
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoFailed) return;

    if (scrollOpacity === 0) {
      video.pause();
    } else if (videoLoaded) {
      video.play().catch(() => {});
    }
  }, [scrollOpacity, videoLoaded, videoFailed]);

  // Video setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = async () => {
      if (hasTriedPlay.current) return;
      hasTriedPlay.current = true;
      try {
        await video.play();
        setVideoLoaded(true);
      } catch {
        try {
          video.muted = true;
          await video.play();
          setVideoLoaded(true);
        } catch {
          setVideoFailed(true);
        }
      }
    };

    const handleReady = () => tryPlay();
    const handleError = () => setVideoFailed(true);

    if (video.readyState >= 3) tryPlay();

    video.addEventListener("loadeddata", handleReady);
    video.addEventListener("canplay", handleReady);
    video.addEventListener("error", handleError);

    const source = video.querySelector("source");
    source?.addEventListener("error", () => setVideoFailed(true));

    const timeout = setTimeout(() => {
      if (!videoLoaded) setVideoFailed(true);
    }, 8000);

    return () => {
      video.removeEventListener("loadeddata", handleReady);
      video.removeEventListener("canplay", handleReady);
      video.removeEventListener("error", handleError);
      clearTimeout(timeout);
    };
  }, [videoLoaded]);

  if (videoFailed) return null;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#080808]"
    >
      {/* Sticky inner — stays in view while section scrolls, fades with scroll */}
      <div
        className="sticky top-0 flex min-h-screen items-center"
        style={{ opacity: scrollOpacity }}
      >
        {/* Video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          className={clsx(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
            videoLoaded ? "opacity-100" : "opacity-0",
          )}
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/80 via-[#080808]/60 to-[#080808]/30" />

        {/* Grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(192,21,42,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(192,21,42,0.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "linear-gradient(to right, black 30%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-[1360px] px-6 py-32 lg:px-10">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-[2px] w-12 bg-[#C0152A]" />
            <span className="font-mono text-[14px] font-semibold uppercase tracking-[0.15em] text-white/80">
              UAE&apos;s Premier MEP Engineering Company
            </span>
          </div>

          <h1 className="max-w-3xl text-6xl font-extrabold leading-[0.9] tracking-tight text-white lg:text-8xl xl:text-9xl">
            Engineering
            <span className="relative ml-4 inline-block text-[#C0152A]">
              Excellence
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
              >
                <path
                  d="M0 10 Q75 0 150 6 T300 4"
                  stroke="#C0152A"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.4"
                />
              </svg>
            </span>
            <span
              className="mt-2 block"
              style={{
                WebkitTextStroke: "2px rgba(255,255,255,0.35)",
                color: "transparent",
              }}
            >
              in MEP.
            </span>
          </h1>

          <p className="mt-8 max-w-[540px] text-xl leading-relaxed text-white/80">
            Delivering innovative, reliable, and high-performance
            electromechanical contracting solutions across the UAE.
          </p>
        </div>

        {/* Scroll indicator — pulses to hint scrolling */}
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
          <div className="relative h-14 w-px overflow-hidden bg-white/15">
            <div className="absolute h-1/2 w-full animate-[scrollLine_2s_ease_infinite] bg-[#C0152A]" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
            Scroll
          </span>
        </div>
      </div>

      <style>{`
        @keyframes scrollLine { 0% { transform: translateY(-100%); } 100% { transform: translateY(200%); } }
      `}</style>
    </section>
  );
}
