import { Download, FileText, ArrowRight } from 'lucide-react'

export default function BrochureDownload() {
  return (
    <section className="relative overflow-hidden bg-[#080808] py-20 lg:py-28">
      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(192,21,42,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(192,21,42,0.2) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Decorative elements */}
      <div className="pointer-events-none absolute -left-20 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full border border-[#C0152A]/10" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-[200px] w-[200px] rounded-full border border-dashed border-white/5" />

      <div className="relative mx-auto max-w-[1360px] px-6 lg:px-10">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:justify-between">
          {/* Left — Content */}
          <div className="max-w-xl text-center lg:text-left">
            <div className="mb-4 flex items-center justify-center gap-3 lg:justify-start">
              <span className="h-[2px] w-8 bg-[#C0152A]" />
              <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#C0152A]">
                Company Profile
              </span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white lg:text-4xl">
              Download Our{' '}
              <span className="text-[#C0152A]">Company Brochure</span>
            </h2>

            <p className="mt-4 text-[16px] leading-relaxed text-white/60">
              Get a comprehensive overview of our services, capabilities,
              certifications, and project portfolio. Learn how Electrotech
              delivers integrated MEP solutions across the UAE.
            </p>

            {/* Highlights */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 lg:justify-start">
              {['Services Overview', 'Project Portfolio', 'Certifications', 'Company Profile'].map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[13px] font-medium text-white/50"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C0152A]" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Download Card */}
          <div className="w-full max-w-sm">
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-[#C0152A]/30 hover:bg-white/10">
              {/* PDF Icon */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#C0152A]/10">
                <FileText className="h-10 w-10 text-[#C0152A]" />
              </div>

              <div className="text-center">
                <h3 className="text-lg font-extrabold text-white">
                  Electrotech Brochure
                </h3>
                <p className="mt-1 text-[13px] text-white/40">
                  PDF • Company Profile
                </p>
              </div>

              {/* Download button */}
              
                <a href="/documents/electrotech-brochure.pdf"
                download
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-[#C0152A] py-4 text-[14px] font-bold uppercase tracking-[0.06em] text-white transition-all hover:bg-[#960F20] hover:shadow-[0_8px_30px_rgba(192,21,42,0.4)]"
              >
                <Download className="h-5 w-5" />
                Download Brochure
              </a>

              <p className="mt-4 text-center text-[11px] text-white/25">
                Free download • No signup required
              </p>

              {/* Corner accent */}
              <div className="absolute right-0 top-0 h-16 w-16 overflow-hidden">
                <div className="absolute -right-8 -top-8 h-16 w-16 rotate-45 bg-[#C0152A]/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}