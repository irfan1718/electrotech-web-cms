"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, MapPin, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface Project {
  _id: string;
  title: string;
  caption: string;
  slug: string;
  thumbnail: string | null;
  category: string;
  location: string;
  projectStatus: string;
}

interface ProjectCarouselProps {
  projects: Project[];
}

export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning],
  );

  const next = useCallback(() => {
    goTo((current + 1) % projects.length);
  }, [current, projects.length, goTo]);

  const prev = useCallback(() => {
    goTo(current === 0 ? projects.length - 1 : current - 1);
  }, [current, projects.length, goTo]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  if (projects.length === 0) return null;

  const project = projects[current];

  return (
    <div className="relative h-[600px] w-full overflow-hidden bg-[#080808] lg:h-[700px]">
      {/* Background images */}
      {projects.map((p, i) => (
        <div
          key={p._id}
          className={clsx(
            "absolute inset-0 transition-all duration-[800ms]",
            i === current ? "scale-100 opacity-100" : "scale-110 opacity-0",
          )}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          {p.thumbnail ? (
            <img
              src={p.thumbnail}
              alt={p.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-neutral-800 to-neutral-900" />
          )}
        </div>
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "linear-gradient(to right, black 20%, transparent 50%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1360px] flex-col justify-end px-6 pb-16 lg:justify-center lg:pb-0 lg:px-10">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center gap-3">
          <span className="h-[2px] w-8 bg-[#C0152A]" />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/50">
            Featured Project
          </span>
        </div>

        {/* Category + Location */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {project.category && (
            <span className="rounded border border-[#C0152A]/40 bg-[#C0152A]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#C0152A] backdrop-blur-sm">
              {project.category}
            </span>
          )}
          {project.location && (
            <span className="flex items-center gap-1 text-[12px] text-white/40">
              <MapPin className="h-3 w-3" />
              {project.location}
            </span>
          )}
          {project.projectStatus && (
            <span className="rounded border border-white/10 px-3 py-1 text-[11px] capitalize text-white/40 backdrop-blur-sm">
              {project.projectStatus.replace("-", " ")}
            </span>
          )}
        </div>

        {/* Title */}
        <h2
          className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-white lg:text-5xl"
          key={current}
        >
          {project.title}
        </h2>

        {/* Caption */}
        <p className="mt-4 max-w-lg text-base leading-relaxed text-white/50">
          {project.caption}
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={`/projects/${project.slug}`}
            className="group flex items-center gap-3 rounded-lg bg-[#C0152A] px-7 py-3.5 text-[15px] font-bold uppercase tracking-[0.06em] text-white transition-all hover:bg-[#960F20] hover:shadow-[0_8px_30px_rgba(192,21,42,0.4)]"
          >
            View Project Details
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/projects"
            className="flex items-center gap-3 rounded-lg border-[1.5px] border-white/20 px-7 py-3.5 text-[15px] font-bold uppercase tracking-[0.06em] text-white transition-all hover:border-white/40 hover:bg-white/5"
          >
            All Projects
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Right side — Navigation + Slide info */}
      <div className="absolute bottom-8 right-6 z-10 flex items-center gap-4 lg:bottom-auto lg:right-10 lg:top-1/2 lg:-translate-y-1/2 lg:flex-col">
        {/* Prev/Next */}
        <button
          onClick={prev}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/50 backdrop-blur-sm transition-all hover:border-white/40 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Progress dots — vertical on desktop */}
        <div className="flex gap-2 lg:flex-col">
          {projects.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className="group relative">
              <span
                className={clsx(
                  "block rounded-full transition-all duration-300",
                  i === current
                    ? "h-2.5 w-8 bg-[#C0152A] lg:h-8 lg:w-2.5"
                    : "h-2.5 w-2.5 bg-white/20 hover:bg-white/40",
                )}
              />
            </button>
          ))}
        </div>

        <button
          onClick={next}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#C0152A]/20 text-white backdrop-blur-sm transition-all hover:bg-[#C0152A] hover:shadow-lg"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* Bottom — Slide counter */}
      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-4 lg:flex">
        <span className="font-mono text-[11px] text-white/30">
          {String(current + 1).padStart(2, "0")}
        </span>
        <div className="h-px w-16 bg-white/15">
          <div
            className="h-full bg-[#C0152A] transition-all duration-500"
            style={{ width: `${((current + 1) / projects.length) * 100}%` }}
          />
        </div>
        <span className="font-mono text-[11px] text-white/30">
          {String(projects.length).padStart(2, "0")}
        </span>
      </div>

      {/* Thumbnail strip — desktop only */}
      <div className="absolute bottom-8 left-10 z-10 hidden gap-2 xl:flex">
        {projects.map((p, i) => (
          <button
            key={p._id}
            onClick={() => goTo(i)}
            className={clsx(
              "h-16 w-24 overflow-hidden rounded-lg border-2 transition-all duration-300",
              i === current
                ? "border-[#C0152A] opacity-100"
                : "border-transparent opacity-40 hover:opacity-70",
            )}
          >
            {p.thumbnail ? (
              <img
                src={p.thumbnail}
                alt={p.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-neutral-800" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
