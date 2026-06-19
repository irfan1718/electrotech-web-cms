"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";

interface ImageCarouselProps {
  images: { src: string; alt: string; caption?: string }[];
  autoPlay?: boolean;
  interval?: number;
}

export default function ImageCarousel({
  images,
  autoPlay = true,
  interval = 4000,
}: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [isTransitioning],
  );

  const next = useCallback(() => {
    goTo((current + 1) % images.length);
  }, [current, images.length, goTo]);

  const prev = useCallback(() => {
    goTo(current === 0 ? images.length - 1 : current - 1);
  }, [current, images.length, goTo]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, next]);

  if (images.length === 0) return null;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-neutral-100">
      {/* Images */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {images.map((img, i) => (
          <div
            key={i}
            className={clsx(
              "absolute inset-0 transition-all duration-[600ms]",
              i === current
                ? "scale-100 opacity-100"
                : i < current
                  ? "-translate-x-full scale-105 opacity-0"
                  : "translate-x-full scale-105 opacity-0",
            )}
            style={{
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="h-full w-full object-cover"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        ))}

        {/* Caption */}
        {images[current]?.caption && (
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-sm font-medium text-white/90">
              {images[current].caption}
            </p>
          </div>
        )}

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-white/20 group-hover:opacity-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-white/20 group-hover:opacity-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Red corner accent */}
        <div className="absolute left-0 top-0 h-14 w-14 bg-[#000000]/80">
          <div className="flex h-full w-full items-center justify-center">
            <Image
              src="/images/logo-electrotech.png"
              alt="Electrotech Electromechanical"
              width={44}
              height={44}
              className="h-auto w-[44px] object-contain"
              priority
            />
            {/* <svg viewBox="0 0 200 170" className="h-7 w-8">
              <path
                d="M116 12L70 78 95 78 56 130 88 130 38 168 130 88 100 88 132 50 105 50 138 18Z"
                fill="white"
              />
            </svg> */}
          </div>
        </div>
      </div>

      {/* Dots + Progress */}
      <div className="flex items-center justify-between bg-white px-5 py-3">
        <div className="flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={clsx(
                "h-1.5 rounded-full transition-all duration-300",
                i === current
                  ? "w-8 bg-[#C0152A]"
                  : "w-1.5 bg-neutral-200 hover:bg-neutral-300",
              )}
            />
          ))}
        </div>
        <span className="font-mono text-[11px] text-neutral-400">
          {String(current + 1).padStart(2, "0")} /{" "}
          {String(images.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
