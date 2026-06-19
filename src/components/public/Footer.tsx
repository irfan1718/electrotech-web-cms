import Image from "next/image";
import Link from "next/link";

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const services = [
  { label: "Electrical Systems", href: "/services/electrical-systems" },
  { label: "HVAC & Ventilation", href: "/services/hvac-smoke-management" },
  { label: "Plumbing & Drainage", href: "/services/plumbing-drainage" },
  { label: "Fire Fighting & Alarm", href: "/services/fire-fighting-alarm" },
  { label: "ELV / Low Current", href: "/services/elv-low-current-systems" },
  {
    label: "Building Management",
    href: "/services/building-management-systems",
  },
  { label: "Testing & Commissioning", href: "/services/testing-commissioning" },
  { label: "Maintenance Services", href: "/services/maintenance-services" },
];

const company = [
  { label: "About Electrotech", href: "/about" },
  { label: "Our Projects", href: "/projects" },
  { label: "Engineering Team", href: "/team" },
  { label: "Careers", href: "/careers" },
  { label: "Blog & Insights", href: "/blogs" },
  { label: "Contact Us", href: "/contact" },
];

const sectors = [
  "Commercial",
  "Residential",
  "Hospitality",
  "Healthcare",
  "Industrial",
  "Infrastructure",
  "Government",
];

export default function Footer() {
  return (
    <footer className="bg-[#080808]">
      {/* CTA Strip */}
      <div className="bg-[#C0152A]">
        <div className="mx-auto flex max-w-[1360px] flex-col items-center justify-between gap-4 px-6 py-5 sm:flex-row lg:px-10">
          <p className="text-base font-bold text-white">
            Ready to start your next MEP project?
          </p>
          <Link
            href="/contact"
            className="border-[1.5px] border-white/50 px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition hover:border-white hover:bg-white hover:text-[#C0152A]"
          >
            Get in Touch →
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <div className="grid gap-12 border-b border-white/[0.06] py-16 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Image
                src="/images/logo-electrotech.png"
                alt="Electrotech logo"
                width={44}
                height={44}
                className="h-auto w-[44px] object-contain"
              />
              <div>
                <p className="text-xl font-black tracking-wide text-white">
                  ELECTRO<span className="text-[#C0152A]">TECH</span>
                </p>
                <p className="text-[9px] uppercase tracking-[0.15em] text-white/75">
                  Electromechanical Contracting LLC
                </p>
              </div>
            </div>

            <p className="mb-6 max-w-[280px] text-[13.5px] leading-relaxed text-white/75">
              A specialized MEP contracting company delivering integrated
              engineering solutions across the UAE since 2003.
            </p>

            {/* Certifications */}
            <div className="flex flex-wrap gap-2">
              {["ISO 9001", "OHSAS 18001", "UAE Licensed", "DEWA Approved"].map(
                (cert) => (
                  <span
                    key={cert}
                    className="border border-white/[0.12] px-2.5 py-1 font-mono text-[9.5px] tracking-[0.08em] text-white/75 transition hover:border-[#C0152A] hover:text-[#C0152A]"
                  >
                    {cert}
                  </span>
                ),
              )}
            </div>

            {/* Social */}
            <div className="mt-6 flex gap-2.5">
              {[LinkedinIcon, XIcon, InstagramIcon].map((Icon, i) => (
                <button
                  key={i}
                  className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/75 transition hover:border-[#C0152A] hover:bg-[#C0152A]/10 hover:text-[#C0152A]"
                >
                  <Icon />
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="mb-5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/75">
              Services
            </p>
            <ul className="space-y-3">
              {services.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-2 text-[13.5px] text-white/75 transition hover:text-white"
                  >
                    <span className="h-px w-0 bg-[#C0152A] transition-all group-hover:w-4" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="mb-5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/75">
              Company
            </p>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-2 text-[13.5px] text-white/75 transition hover:text-white"
                  >
                    <span className="h-px w-0 bg-[#C0152A] transition-all group-hover:w-4" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sectors */}
          <div>
            <p className="mb-5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/75">
              Sectors
            </p>
            <ul className="space-y-3">
              {sectors.map((sector) => (
                <li key={sector}>
                  <Link
                    href="/projects"
                    className="group flex items-center gap-2 text-[13.5px] text-white/75 transition hover:text-white"
                  >
                    <span className="h-px w-0 bg-[#C0152A] transition-all group-hover:w-4" />
                    {sector}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="font-mono text-[11px] tracking-[0.06em] text-white/75">
            © 2026 Electrotech Electromechanical Contracting LLC. All Rights
            Reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Use", "Sitemap"].map((item) => (
              <Link
                key={item}
                href="#"
                className="font-mono text-[11px] tracking-[0.06em] text-white/75 transition hover:text-white/50"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
