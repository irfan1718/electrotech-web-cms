"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import clsx from "clsx";

const testimonials = [
  {
    quote:
      "Electrotech delivered our 42-floor commercial tower MEP systems on time and within budget. Their engineering coordination and quality of execution exceeded our expectations.",
    name: "Ahmed Al Maktoum",
    designation: "Director of Projects",
    company: "Emaar Properties",
  },
  {
    quote:
      "We have worked with Electrotech on multiple hospitality projects. Their HVAC and fire fighting systems are consistently reliable, and their team is highly professional.",
    name: "Fatima Al Qasimi",
    designation: "VP Engineering",
    company: "Al Habtoor Group",
  },
  {
    quote:
      "The quality of MEP installation and testing & commissioning delivered by Electrotech on our healthcare facility was outstanding. A truly dependable contractor.",
    name: "Rajesh Menon",
    designation: "Senior Project Manager",
    company: "DAMAC Properties",
  },
  {
    quote:
      "Electrotech handled the complete electrical and ELV systems for our mixed-use development. Their attention to detail and safety record is impressive.",
    name: "Khalid Bin Saeed",
    designation: "Chief Development Officer",
    company: "Nakheel",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const prev = () =>
    setActive((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () =>
    setActive((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  return (
    <section className="bg-[#F7F7F8] py-20 lg:py-28">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        {/* Header */}
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[1.5px] w-7 bg-[#C0152A]" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#C0152A]">
                Testimonials
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#080808] lg:text-4xl">
              What Our <span className="text-[#C0152A]">Clients Say</span>
            </h2>
          </div>

          {/* Navigation arrows */}
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 text-neutral-400 transition hover:border-neutral-400 hover:text-neutral-700"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-[#C0152A] text-white transition hover:bg-[#960F20]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Testimonial cards */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Featured large card */}
          <div className="relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-8 lg:col-span-2 lg:p-12">
            {/* Red accent */}
            <div className="absolute left-0 top-0 h-full w-[4px] bg-[#C0152A]" />

            {/* Quote icon */}
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-red-50">
              <Quote className="h-5 w-5 text-[#C0152A]" />
            </div>

            {/* Quote text */}
            <p className="text-lg font-medium leading-relaxed text-neutral-700 lg:text-xl lg:leading-relaxed">
              &ldquo;{testimonials[active].quote}&rdquo;
            </p>

            {/* Author */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C0152A] text-sm font-bold text-white">
                {testimonials[active].name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#080808]">
                  {testimonials[active].name}
                </p>
                <p className="text-[13px] text-neutral-500">
                  {testimonials[active].designation},{" "}
                  <span className="font-medium text-[#C0152A]">
                    {testimonials[active].company}
                  </span>
                </p>
              </div>
            </div>

            {/* Dots */}
            <div className="mt-8 flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={clsx(
                    "h-2 rounded-full transition-all",
                    active === i
                      ? "w-8 bg-[#C0152A]"
                      : "w-2 bg-neutral-200 hover:bg-neutral-300",
                  )}
                />
              ))}
            </div>
          </div>

          {/* Side cards — show next 2 */}
          <div className="flex flex-col gap-5">
            {[1, 2].map((offset) => {
              const idx = (active + offset) % testimonials.length;
              const t = testimonials[idx];
              return (
                <button
                  key={idx}
                  onClick={() => setActive(idx)}
                  className={clsx(
                    "flex-1 rounded-xl border bg-white p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg",
                    active === idx
                      ? "border-[#C0152A]/20"
                      : "border-neutral-100",
                  )}
                >
                  <Quote className="mb-3 h-5 w-5 text-neutral-200" />
                  <p className="line-clamp-3 text-[13px] leading-relaxed text-neutral-500">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-[10px] font-bold text-[#C0152A]">
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-neutral-700">
                        {t.name}
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        {t.company}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
