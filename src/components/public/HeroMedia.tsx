"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";

export default function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [progress, setProgress] = useState(0); // 0 = full video, 1 = full image
  const hasTriedPlay = useRef(false);

  // Scroll controls the blend: 0% scroll = video, 100% scroll = image
  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      const y = window.scrollY;
      const p = Math.min(Math.max(y / (vh * 0.6), 0), 1);
      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pause video when fully scrolled to image
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoFailed) return;

    if (progress >= 1) {
      video.pause();
    } else if (videoLoaded) {
      video.play().catch(() => {});
    }
  }, [progress, videoLoaded, videoFailed]);

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

  return (
    <>
      {/* Layer 1: Image (always present, fades in with scroll) */}
      <Image
        src="/images/hero.jpg"
        alt="Electrotech MEP Engineering"
        fill
        priority
        className="object-cover"
        style={{ opacity: videoFailed ? 1 : progress }}
      />

      {/* Layer 2: Video (on top, fades out with scroll) */}
      {!videoFailed && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          className={clsx(
            "absolute inset-0 h-full w-full object-cover",
            videoLoaded ? "" : "opacity-0",
          )}
          style={{ opacity: videoLoaded ? 1 - progress : 0 }}
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
      )}
    </>
  );
}
