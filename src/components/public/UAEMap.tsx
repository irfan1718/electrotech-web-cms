'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin } from 'lucide-react'

interface Office {
  id: string
  city: string
  address: string
  phone: string
  fax?: string
  poBox?: string
  x: number // percentage from left
  y: number // percentage from top
}

const offices: Office[] = [
  {
    id: "dubai",
    city: "Dubai",
    address: "Al Quoz Industrial Area 3, Dubai, U.A.E.",
    phone: "+971 4 000 0000",
    fax: "+971 4 000 0001",
    poBox: "67890",
    x: 72,
    y: 38,
  },
];

export default function UAEMap() {
  const [activeOffice, setActiveOffice] = useState<string | null>(null)
  const active = offices.find((o) => o.id === activeOffice)

  return (
    <div className="relative mx-auto w-full max-w-[700px]">
      {/* Map image — use as mask so it works on light background */}
      <div className="relative aspect-[1030/830]">
        {/* Map shape via CSS mask */}
        <div
          className="absolute inset-0 bg-[#E2E4E8]"
          style={{
            WebkitMaskImage: "url(/images/uae-map.png)",
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskImage: "url(/images/uae-map.png)",
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
          }}
        />

        {/* Office Pins */}
        {offices.map((office) => {
          const isActive = activeOffice === office.id;

          return (
            <div
              key={office.id}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${office.x}%`, top: `${office.y}%` }}
              onMouseEnter={() => setActiveOffice(office.id)}
              onMouseLeave={() => setActiveOffice(null)}
              onClick={() => setActiveOffice(isActive ? null : office.id)}
            >
              {/* Pulse ring */}
              <span
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all ${
                  isActive
                    ? "h-12 w-12 animate-ping border-[#C0152A]/30"
                    : "h-9 w-9 animate-[ping_2s_ease-in-out_infinite] border-[#3B82F6]/20"
                }`}
              />

              {/* Pin */}
              <button
                className={`relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
                  isActive
                    ? "scale-125 bg-[#C0152A]"
                    : "bg-[#3B82F6] hover:scale-110"
                }`}
              >
                {/* White inner ring */}
                <span className="absolute inset-[3px] rounded-full border-[1.5px] border-white/40" />

                {/* Phone icon */}
                <Phone className="h-3.5 w-3.5 text-white" />
              </button>

              {/* City label */}
              <p
                className={`absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold transition-colors ${
                  isActive ? "text-[#C0152A]" : "text-neutral-400"
                }`}
              >
                {office.city}
              </p>
            </div>
          );
        })}

        {/* Tooltip card */}
        {active && (
          <div
            className="absolute z-30 w-[290px] rounded-xl border border-neutral-100 bg-white p-5 shadow-2xl"
            style={{
              left: `${Math.min(Math.max(active.x, 25), 60)}%`,
              top: `${active.y - 2}%`,
              transform: "translate(-50%, -100%)",
            }}
            onMouseEnter={() => setActiveOffice(active.id)}
            onMouseLeave={() => setActiveOffice(null)}
          >
            {/* Red top bar */}
            <div className="absolute left-0 right-0 top-0 h-[3px] rounded-t-xl bg-[#C0152A]" />

            {/* City */}
            <h4 className="text-[15px] font-extrabold uppercase tracking-wide text-[#080808]">
              {active.city}
            </h4>

            {/* Address label */}
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#C0152A]">
              Address
            </p>

            {/* Address */}
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-600">
              {active.address}
              {active.poBox && `, P.O. Box ${active.poBox}`}
            </p>

            {/* Details */}
            <div className="mt-3.5 space-y-1.5 border-t border-neutral-100 pt-3.5">
              <a
                href={`tel:${active.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-[12.5px] text-neutral-600 transition hover:text-[#C0152A]"
              >
                <Phone className="h-3.5 w-3.5 text-neutral-300" />
                Phone: {active.phone}
              </a>

              {active.fax && (
                <p className="flex items-center gap-2 text-[12.5px] text-neutral-500">
                  <Phone className="h-3.5 w-3.5 text-neutral-300" />
                  Fax: {active.fax}
                </p>
              )}

              {active.poBox && (
                <p className="flex items-center gap-2 text-[12.5px] text-neutral-500">
                  <Mail className="h-3.5 w-3.5 text-neutral-300" />
                  P.O. Box: {active.poBox}
                </p>
              )}
            </div>

            {/* Arrow pointer */}
            <div className="absolute -bottom-[6px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-neutral-100 bg-white" />
          </div>
        )}
      </div>
      {/* <div
        className="absolute inset-0 z-50 cursor-crosshair"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
          const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
          console.log(`Clicked: x: ${x}, y: ${y}`);
          alert(`x: ${x}, y: ${y}`);
        }}
      /> */}
    </div>
  );
}