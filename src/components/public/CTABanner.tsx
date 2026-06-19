import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTABanner({
  title = "Let's Build Together",
  subtitle = "Get in touch with Electrotech for engineering consultation, project inquiries, or partnerships.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(192,21,42,0.03)_0%,transparent_70%)]" />

      <div className="relative mx-auto max-w-[1360px] px-6 text-center lg:px-10">
        <div className="mx-auto max-w-xl">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-[1.5px] w-7 bg-[#C0152A]" />
            <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#C0152A]">
              Contact Us
            </span>
            <span className="h-[1.5px] w-7 bg-[#C0152A]" />
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-[#080808] lg:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-neutral-500">
            {subtitle}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="flex items-center gap-3 rounded-lg bg-[#C0152A] px-10 py-5 text-[15px] font-bold uppercase tracking-[0.06em] text-white transition hover:bg-[#960F20]"
            >
              Get in Touch <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/projects"
              className="flex items-center gap-3 rounded-lg border-[1.5px] border-neutral-300 px-10 py-5 text-[15px] font-bold uppercase tracking-[0.06em] text-neutral-700 transition hover:border-neutral-500"
            >
              View Our Work <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
