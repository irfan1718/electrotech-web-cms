import Image from "next/image";

const clients = [
  { name: "Wasl LLC", logo: "/images/clients/wasl.png" },
  { name: "Nshama LLC", logo: "/images/clients/nshama.png" },
  { name: "Object One LLC", logo: "/images/clients/object-one.png" },
  { name: "DRC Propco (Domus)", logo: "/images/clients/drc-propco.png" },
  {
    name: "First Driving Center LLC",
    logo: "/images/clients/first-driving.png",
  },
  { name: "Bethahab Group", logo: "/images/clients/bethahab.png" },
  { name: "Lulu", logo: "/images/clients/lulu.png" },
  {
    name: "National Properties",
    logo: "/images/clients/national-properties.png",
  },
  { name: "Jag Real Estate LLC", logo: "/images/clients/jag.png" },
  { name: "BAM Eskan Real Estate", logo: "/images/clients/bam-eskan.png" },
  { name: "Azizi Developments", logo: "/images/clients/azizi.png" },
  { name: "Dubai Police", logo: "/images/clients/dubai-police.png" },
  {
    name: "Dubai Municipality",
    logo: "/images/clients/dubai-municipality.png",
  },
];

function ClientCard({ client }: { client: { name: string; logo: string } }) {
  return (
    <div className="group relative mx-3 flex h-[88px] w-56 shrink-0 items-center justify-center rounded-2xl border border-neutral-100 bg-white px-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Image
        src={client.logo}
        alt={client.name}
        width={180}
        height={72}
        className="max-h-[52px] max-w-[150px] object-contain"
      />

      {/* Name tooltip — appears on hover */}
      <div className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#080808] px-3.5 py-1.5 text-[11px] font-semibold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100">
        {client.name}
        {/* Arrow */}
        <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#080808]" />
      </div>
    </div>
  );
}

export default function ClientLogos() {
  return (
    <section className="relative bg-[#F7F7F8] py-16">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <div className="mb-12 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-8 bg-[#C0152A]" />
            <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#C0152A]">
              Our Clients
            </span>
            <span className="h-[2px] w-8 bg-[#C0152A]" />
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight text-[#080808]">
            Trusted by Leading{" "}
            <span className="text-[#C0152A]">UAE Organizations</span>
          </h3>
        </div>
      </div>

      {/* Row 1 */}
      <div className="relative overflow-hidden pb-10">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[#F7F7F8] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[#F7F7F8] to-transparent" />

        <div className="flex animate-[logoScroll_45s_linear_infinite] hover:[animation-play-state:paused]">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex shrink-0">
              {clients.map((client) => (
                <ClientCard key={`${dup}-${client.name}`} client={client} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — reverse */}
      <div className="relative overflow-hidden pb-10">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[#F7F7F8] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[#F7F7F8] to-transparent" />

        <div className="flex animate-[logoScrollReverse_50s_linear_infinite] hover:[animation-play-state:paused]">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex shrink-0">
              {[...clients].reverse().map((client) => (
                <ClientCard key={`${dup}-rev-${client.name}`} client={client} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes logoScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes logoScrollReverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
