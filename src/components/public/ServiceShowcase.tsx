"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, ImageIcon } from "lucide-react";
import clsx from "clsx";

interface Service {
  _id: string;
  title: string;
  caption: string;
  slug: string;
  thumbnail: string | null;
  order: number;
}

export default function ServiceShowcase({ services }: { services: Service[] }) {
  const [active, setActive] = useState(0);

  if (services.length === 0) return null;

  const current = services[active];

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-0">
      {/* Left — Service List */}
      <div className="relative">
        {/* Vertical red line */}
        <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-neutral-200 lg:block" />

        <div className="space-y-1">
          {services.map((service, i) => (
            <button
              key={service._id}
              onClick={() => setActive(i)}
              className={clsx(
                "group relative flex w-full items-center gap-5 px-6 py-5 text-left transition-all lg:px-8",
                active === i ? "bg-red-50/80" : "hover:bg-neutral-50",
              )}
            >
              {/* Active indicator — red bar on left */}
              <div
                className={clsx(
                  "absolute left-0 top-0 hidden h-full w-[3px] transition-all lg:block",
                  active === i ? "bg-[#C0152A]" : "bg-transparent",
                )}
              />

              {/* Number */}
              <span
                className={clsx(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[14px] font-bold transition-all",
                  active === i
                    ? "bg-[#C0152A] text-white shadow-lg shadow-red-200"
                    : "bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Title + Caption */}
              <div className="min-w-0 flex-1">
                <h3
                  className={clsx(
                    "text-[16px] font-bold transition-colors",
                    active === i
                      ? "text-[#C0152A]"
                      : "text-neutral-800 group-hover:text-neutral-900",
                  )}
                >
                  {service.title}
                </h3>
                <p
                  className={clsx(
                    "mt-0.5 truncate text-[13px] transition-colors",
                    active === i ? "text-neutral-600" : "text-neutral-400",
                  )}
                >
                  {service.caption}
                </p>
              </div>

              {/* Arrow */}
              <ChevronRight
                className={clsx(
                  "h-5 w-5 shrink-0 transition-all",
                  active === i
                    ? "translate-x-1 text-[#C0152A]"
                    : "text-neutral-300 group-hover:text-neutral-500",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Right — Active Service Detail */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-100 bg-white lg:rounded-none lg:border-0">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 lg:aspect-auto lg:h-full lg:min-h-[500px]">
          {current.thumbnail ? (
            <img
              src={current.thumbnail}
              alt={current.title}
              className="h-full w-full object-cover transition-all duration-700"
              key={current._id}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
              <ImageIcon className="h-16 w-16 text-neutral-300" />
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/80 via-[#080808]/30 to-transparent" />

          {/* Content on image */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            {/* Number tag */}
            <span className="mb-4 inline-block rounded bg-[#C0152A] px-3 py-1 text-[12px] font-bold text-white">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(services.length).padStart(2, "0")}
            </span>

            <h3 className="text-2xl font-extrabold text-white lg:text-3xl">
              {current.title}
            </h3>

            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/70">
              {current.caption}
            </p>

            <Link
              href={`/services/${current.slug}`}
              className="group mt-6 inline-flex items-center gap-3 rounded-lg bg-white/10 px-6 py-3 text-[14px] font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              View Service Details
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
