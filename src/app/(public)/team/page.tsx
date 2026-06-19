import { connectDB } from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";
import Career from "@/models/Career";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/public/PageHero";
import SectionHeading from "@/components/public/SectionHeading";
import TeamCard from "@/components/public/TeamCard";
import Animate from "@/components/public/Animate";

export const revalidate = 3600;

export async function generateMetadata() {
  return {
    title: "Our Team | Electrotech MEP",
    description: "Meet the engineering leadership behind Electrotech.",
  };
}

export default async function TeamPage() {
  await connectDB();
  const [team, openCareers] = await Promise.all([
    TeamMember.find().sort({ order: 1 }).lean(),
    Career.countDocuments({ status: "open" }),
  ]);
  const data = JSON.parse(JSON.stringify(team));

  return (
    <>
      <PageHero
        title="Our Team"
        subtitle="Meet the engineering leadership driving Electrotech's commitment to MEP excellence across the UAE."
        breadcrumbs={[{ label: "Team" }]}
        image="/images/hero-section/team.png"
      />

      {/* ── LEADERSHIP SECTION ── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <Animate animation="fadeUp">
            <SectionHeading
              eyebrow="Leadership"
              title="Engineering Professionals"
              highlight="Behind Every Project"
              description="Our team brings decades of combined MEP engineering experience, managing complex projects across commercial, healthcare, hospitality, and infrastructure sectors."
            />
          </Animate>

          {data.length > 0 ? (
            <div className="mt-14 grid gap-5 sm:grid-cols-2">
              {data.map((member: any, i: number) => (
                <Animate key={member._id} animation="fadeUp" delay={i * 100}>
                  <TeamCard
                    name={member.name}
                    designation={member.designation}
                    caption={member.caption}
                    profileImage={member.profileImage}
                    layout="wide"
                  />
                </Animate>
              ))}
            </div>
          ) : (
            <div className="mt-14 flex h-60 items-center justify-center rounded-xl border border-neutral-100 bg-[#F7F7F8] text-neutral-400">
              Team profiles coming soon
            </div>
          )}
        </div>
      </section>

      {/* ── VALUES STRIP ── */}
      <section className="border-y border-neutral-100 bg-[#F7F7F8] py-16">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "200+", label: "Engineers & Technicians" },
              { value: "20+", label: "Years Combined Experience" },
              { value: "7", label: "Core MEP Disciplines" },
              { value: "100%", label: "Licensed Professionals" },
            ].map((stat, i) => (
              <Animate key={stat.label} animation="scaleUp" delay={i * 100}>
                <div className="text-center">
                  <p className="text-4xl font-extrabold tracking-tight text-[#080808]">
                    {stat.value.replace(/[+%]/, "")}
                    <span className="text-[#C0152A]">
                      {stat.value.includes("+")
                        ? "+"
                        : stat.value.includes("%")
                          ? "%"
                          : ""}
                    </span>
                  </p>
                  <p className="mt-2 text-[15px] font-bold text-neutral-600">
                    {stat.label}
                  </p>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAREERS CTA ── */}
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <Animate animation="fadeUp">
          <div className="flex flex-col items-center justify-between gap-8 rounded-2xl border border-neutral-100 bg-[#F7F7F8] p-10 sm:flex-row sm:p-14">
            <div>
              <h2 className="text-2xl font-extrabold text-[#080808]">
                Join Our Team
              </h2>
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-neutral-600">
                We&apos;re always looking for talented engineers and technicians
                to join the Electrotech family.
              </p>
              {openCareers > 0 && (
                <p className="mt-3 text-sm text-neutral-400">
                  <span className="font-bold text-[#C0152A]">
                    {openCareers}
                  </span>{" "}
                  open {openCareers === 1 ? "position" : "positions"} available
                </p>
              )}
            </div>

            <Link
              href="/careers"
              className="flex shrink-0 items-center gap-2 rounded-lg bg-[#C0152A] px-7 py-3.5 text-[13px] font-bold uppercase tracking-wider text-white transition hover:bg-[#960F20]"
            >
              View Open Positions
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          </Animate>
        </div>
      </section>
    </>
  );
}
