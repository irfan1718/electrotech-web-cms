import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  image?: string; // optional background image
}

export default function PageHero({
  title,
  subtitle,
  breadcrumbs,
  image = "/images/hero-section/page-hero-bg.png",
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-neutral-900">
      {/* Background image — full opacity */}
      {image && (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Single gradient overlay — just enough for text readability */}
      <div className="absolute inset-0 bg-[#080808]/40" />

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(rgba(192,21,42,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(192,21,42,0.12) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "linear-gradient(to right, black 40%, transparent 80%)",
        }}
      />

      {/* Red accent line at top */}
      <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-[#C0152A] via-[#C0152A]/60 to-transparent" />

      {/* Decorative circle */}
      <div className="pointer-events-none absolute -right-20 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full border border-white/5" />

      <div className="relative mx-auto max-w-[1360px] px-6 pb-16 pt-10 lg:px-10 lg:pb-24 lg:pt-14">
        {breadcrumbs && (
          <div className="mb-8 flex items-center gap-2">
            <Link
              href="/"
              className="text-[13px] font-medium text-white/50 transition hover:text-[#C0152A]"
            >
              Home
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3 text-white/25" />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-[13px] font-medium text-white/50 transition hover:text-[#C0152A]"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[13px] font-semibold text-white/80">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </div>
        )}

        <div className="mb-5 flex items-center gap-3">
          <span className="h-[2px] w-10 bg-[#C0152A]" />
          <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#C0152A]">
            Electrotech
          </span>
        </div>

        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-white lg:text-6xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/70">
            {subtitle}
          </p>
        )}

        <div className="mt-10 flex items-center gap-4">
          <div className="h-px w-16 bg-[#C0152A]/50" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#C0152A]" />
        </div>
      </div>
    </section>
  );
}