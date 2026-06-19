import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import PageHero from "@/components/public/PageHero";
import SectionHeading from "@/components/public/SectionHeading";
import ServiceCard from "@/components/public/ServiceCard";
import CTABanner from "@/components/public/CTABanner";
import Animate from "@/components/public/Animate";

export const revalidate = 3600;

export async function generateMetadata() {
  return {
    title: "Our Services | Electrotech MEP",
    description:
      "Comprehensive MEP engineering services — electrical, HVAC, plumbing, fire fighting, ELV, and building management systems.",
  };
}

export default async function ServicesPage() {
  await connectDB();
  const services = await Service.find().sort({ order: 1 }).lean();
  const data = JSON.parse(JSON.stringify(services));

  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Comprehensive MEP engineering services across all electromechanical disciplines."
        breadcrumbs={[{ label: "Services" }]}
        image="/images/hero-section/service.png"
      />

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <Animate animation="fadeUp">
            <SectionHeading
              eyebrow="What We Do"
              title="Integrated MEP"
              highlight="Engineering Solutions"
              description="From design and estimation to installation, testing, and commissioning — we deliver end-to-end electromechanical services."
            />
          </Animate>

          {data.length > 0 ? (
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((service: any, i: number) => (
                <Animate key={service._id} animation="fadeUp" delay={i * 100}>
                  <ServiceCard
                    title={service.title}
                    caption={service.caption}
                    slug={service.slug}
                    index={i}
                    thumbnail={service.thumbnail}
                  />
                </Animate>
              ))}
            </div>
          ) : (
            <div className="mt-14 flex h-60 items-center justify-center rounded-xl border border-neutral-100 bg-[#F7F7F8] text-neutral-400">
              Services coming soon
            </div>
          )}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
