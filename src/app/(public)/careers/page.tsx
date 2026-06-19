import { connectDB } from "@/lib/mongodb";
import Career from "@/models/Career";
import Link from "next/link";
import { MapPin, Briefcase, ArrowRight } from "lucide-react";
import PageHero from "@/components/public/PageHero";
import SectionHeading from "@/components/public/SectionHeading";
import CTABanner from "@/components/public/CTABanner";
import CareerApplyForm from "@/components/public/CareerApplyForm";
import Animate from "@/components/public/Animate";

export const revalidate = 3600;

export async function generateMetadata() {
  return {
    title: "Careers | Electrotech MEP",
    description:
      "Join the Electrotech engineering team. View open positions and submit your CV.",
  };
}

export default async function CareersPage() {
  await connectDB();
  const careers = await Career.find().sort({ createdAt: -1 }).lean();
  const data = JSON.parse(JSON.stringify(careers));

  const open = data.filter((c: any) => c.status === "open");
  const closed = data.filter((c: any) => c.status === "closed");
  const openPositions = open.map((c: any) => c.title);

  return (
    <>
      <PageHero
        title="Careers"
        subtitle={`Join a team of engineering professionals committed to excellence.${open.length > 0 ? ` ${open.length} open position${open.length > 1 ? "s" : ""} available.` : ""}`}
        breadcrumbs={[{ label: "Careers" }]}
        image="/images/hero-section/career.png"
      />

      {/* ── OPEN POSITIONS ── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[900px] px-6 lg:px-10">
          {open.length > 0 ? (
            <div className="space-y-4">
              <h2 className="mb-6 text-2xl font-extrabold text-[#080808]">
                Open Positions
              </h2>
              {open.map((job: any) => (
                <div
                  key={job._id}
                  className="group rounded-xl border border-neutral-100 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-neutral-200 hover:shadow-lg"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#080808]">
                        {job.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-[14px] text-neutral-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5" /> Full-time
                        </span>
                      </div>
                      <p className="mt-3 text-[14px] text-neutral-500">
                        {job.caption}
                      </p>
                    </div>
                    <span className="rounded-full bg-green-50 px-3 py-1 text-[12px] font-semibold text-green-600">
                      Open
                    </span>
                  </div>

                  {job.description && (
                    <div className="mt-4 whitespace-pre-wrap border-t border-neutral-100 pt-4 text-[14px] leading-relaxed text-neutral-500">
                      {job.description}
                    </div>
                  )}

                  <Link
                    href="#application-form"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#C0152A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#a31224]"
                  >
                    Apply Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-neutral-100 bg-[#F7F7F8] p-12 text-center">
              <Briefcase className="mx-auto mb-4 h-10 w-10 text-neutral-300" />
              <h3 className="text-lg font-bold text-neutral-700">
                No Open Positions
              </h3>
              <p className="mt-2 text-[14px] text-neutral-500">
                We don&apos;t have any openings right now, but feel free to
                submit your CV below.
              </p>
            </div>
          )}

          {/* Closed */}
          {closed.length > 0 && (
            <div className="mt-12">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-neutral-400">
                Previously Filled Positions
              </h3>
              <div className="space-y-2">
                {closed.map((job: any) => (
                  <div
                    key={job._id}
                    className="flex items-center justify-between rounded-lg border border-neutral-100 px-5 py-3 opacity-60"
                  >
                    <span className="text-[14px] font-medium text-neutral-600">
                      {job.title}
                    </span>
                    <span className="text-[12px] font-medium text-neutral-400">
                      Closed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── APPLY SECTION ── */}
      <section
        id="application-form"
        className="border-t border-neutral-100 bg-[#F7F7F8] py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[700px] px-6 lg:px-10">
          <SectionHeading
            eyebrow="Apply Now"
            title="Submit Your"
            highlight="Application"
            description="Interested in joining Electrotech? Upload your CV and we'll get back to you."
            center
          />

          <div className="mt-12 rounded-2xl border border-neutral-100 bg-white p-8">
            <CareerApplyForm positions={openPositions} />
          </div>
        </div>
      </section>

      <CTABanner
        title="Have Questions?"
        subtitle="Contact us for more information about career opportunities at Electrotech."
      />
    </>
  );
}
