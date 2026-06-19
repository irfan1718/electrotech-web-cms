import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ChevronRight, ImageIcon } from "lucide-react";
import PageHero from "@/components/public/PageHero";
import CTABanner from "@/components/public/CTABanner";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connectDB();
  const { slug } = await params;
  const service = await Service.findOne({ slug }).lean();
  if (!service) return { title: "Service Not Found" };
  return {
    title: `${service.title} | Electrotech MEP`,
    description: service.caption,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connectDB();
  const { slug } = await params;
  const service = await Service.findOne({ slug }).lean();

  if (!service) notFound();

  const otherServices = await Service.find({ slug: { $ne: slug } })
    .sort({ order: 1 })
    .lean();
  const data = JSON.parse(JSON.stringify(service));
  const others = JSON.parse(JSON.stringify(otherServices));

  return (
    <>
      <PageHero
        title={data.title}
        subtitle={data.caption}
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: data.title },
        ]}
      />

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* ── MAIN CONTENT ── */}
            <div className="lg:col-span-2">
              {data.thumbnail && (
                <img
                  src={data.thumbnail}
                  alt={data.title}
                  className="mb-10 aspect-[16/9] w-full rounded-xl border border-neutral-100 object-cover"
                />
              )}

              <div className="whitespace-pre-wrap text-[15px] leading-[1.85] text-neutral-600">
                {data.body}
              </div>

              {data.detailBody && (
                <>
                  <div className="my-8 h-px bg-neutral-100" />
                  <div className="whitespace-pre-wrap text-[15px] leading-[1.85] text-neutral-600">
                    {data.detailBody}
                  </div>
                </>
              )}
            </div>

            {/* ── SIDEBAR ── */}
            <div>
              <div className="sticky top-32 space-y-5">
                {/* Other services with thumbnails */}
                <div className="rounded-xl border border-neutral-100 bg-white">
                  <div className="border-b border-neutral-100 px-5 py-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                      Other Services
                    </h3>
                  </div>

                  <div className="divide-y divide-neutral-50">
                    {others.map((s: any) => (
                      <Link
                        key={s._id}
                        href={`/services/${s.slug}`}
                        className="group flex items-center gap-3.5 px-5 py-3.5 transition-colors hover:bg-[#F7F7F8]"
                      >
                        {/* Thumbnail */}
                        {s.thumbnail ? (
                          <img
                            src={s.thumbnail}
                            alt={s.title}
                            className="h-12 w-16 shrink-0 rounded-lg border border-neutral-100 object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-neutral-200 bg-[#F7F7F8]">
                            <ImageIcon className="h-5 w-5 text-neutral-300" />
                          </div>
                        )}

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-semibold text-neutral-700 transition-colors group-hover:text-[#C0152A]">
                            {s.title}
                          </p>
                          <p className="mt-0.5 line-clamp-1 text-[11px] text-neutral-400">
                            {s.caption}
                          </p>
                        </div>

                        <ChevronRight className="h-5 w-5 shrink-0 text-neutral-300 transition-colors group-hover:text-[#C0152A]" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Quick contact card */}
                <div className="rounded-xl border border-neutral-100 bg-[#F7F7F8] p-6">
                  <h4 className="text-sm font-bold text-[#080808]">
                    Need This Service?
                  </h4>
                  <p className="mt-2 text-[13px] leading-relaxed text-neutral-500">
                    Get in touch with our engineering team for consultation and
                    project quotation.
                  </p>

                  <Link
                    href="/contact"
                    className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#C0152A] px-5 py-3.5 text-[12px] font-bold uppercase tracking-wider text-white transition hover:bg-[#960F20]"
                  >
                    Request a Quote <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <Link
                    href="tel:+97140000000"
                    className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-5 py-3 text-[12px] font-bold uppercase tracking-wider text-neutral-600 transition hover:border-neutral-400"
                  >
                    Call +971 4 000 0000
                  </Link>
                </div>

                {/* Back to all services */}
                <Link
                  href="/services"
                  className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-5 py-3 text-[13px] font-medium text-neutral-500 transition hover:border-neutral-400 hover:text-neutral-700"
                >
                  ← View All Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
