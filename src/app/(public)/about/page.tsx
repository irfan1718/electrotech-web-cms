import { connectDB } from '@/lib/mongodb'
import About from '@/models/About'
import PageHero from '@/components/public/PageHero'
import SectionHeading from '@/components/public/SectionHeading'
import StatsCounter from '@/components/public/StatsCounter'
import CTABanner from '@/components/public/CTABanner'
import Animate from '@/components/public/Animate'
import { Shield, Eye, Target, Heart, Lightbulb, Users, Award, Leaf } from 'lucide-react'
import Image from 'next/image'

export const revalidate = 3600

export async function generateMetadata() {
  return {
    title: 'About Us | Electrotech MEP',
    description: 'Learn about Electrotech Electromechanical Contracting LLC — delivering integrated MEP solutions across the UAE since 2003.',
  }
}

const values = [
  { icon: Award, title: 'Quality Excellence', desc: 'Delivering projects that exceed industry standards and client expectations.' },
  { icon: Shield, title: 'Integrity & Transparency', desc: 'Honest communication and ethical business practices at every level.' },
  { icon: Lightbulb, title: 'Innovation', desc: 'Embracing modern engineering technologies and construction methodologies.' },
  { icon: Heart, title: 'Client Commitment', desc: 'Building lasting relationships through reliable service and consistent delivery.' },
  { icon: Target, title: 'Safety First', desc: 'Zero-compromise HSE standards embedded in every project phase.' },
  { icon: Leaf, title: 'Sustainability', desc: 'Energy-efficient solutions aligned with UAE green building initiatives.' },
  { icon: Users, title: 'Teamwork', desc: 'Collaborative engineering approach with accountability at every level.' },
  { icon: Eye, title: 'Continuous Improvement', desc: 'Constantly refining processes, skills, and project delivery standards.' },
]

export default async function AboutPage() {
  await connectDB()
  const about = await About.findOne().lean()

  return (
    <>
      <PageHero
        title="About Electrotech"
        subtitle="A specialized MEP contracting company delivering integrated engineering solutions across the UAE."
        breadcrumbs={[{ label: "About Us" }]}
        image="/images/hero-section/about.png"
      />

      {/* ── COMPANY OVERVIEW ── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <div className="grid items-start gap-16 lg:grid-cols-2">
            <Animate animation="fadeRight">
              <div>
                <SectionHeading
                  eyebrow="Who We Are"
                  title={about?.title || "About Electrotech"}
                  highlight="MEP Solutions"
                />

                <p className="mt-6 text-[17px] leading-[1.8] text-neutral-700">
                  {about?.caption ||
                    "Building Engineering Solutions with Quality & Precision"}
                </p>

                <div className="mt-8 whitespace-pre-wrap text-[15px] leading-relaxed text-neutral-600">
                  {about?.body ||
                    "Electrotech Electromechanical Contracting LLC is a specialized MEP contracting company delivering integrated engineering solutions for residential, commercial, industrial, hospitality, healthcare, and infrastructure developments across the UAE."}
                </div>
              </div>
            </Animate>

            {/* Visual */}
            <Animate animation="fadeLeft" delay={200}>
              <div className="relative">
                <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-[#F7F7F8] p-12">
                  <div className="flex flex-col items-center text-center">
                    <Image
                      src="/images/logo-electrotech.png"
                      alt="Electrotech Electromechanical"
                      width={240}
                      height={240}
                      className="h-auto w-[240px] object-contain"
                      priority
                    />

                    <p className="text-xl font-extrabold tracking-wide text-[#080808]">
                      ELECTRO<span className="text-[#C0152A]">TECH</span>
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                      Electromechanical Contracting LLC
                    </p>
                    <span className="mt-6 h-[2px] w-10 bg-[#C0152A]" />
                    <p className="mt-6 max-w-xs text-sm italic text-neutral-400">
                      &ldquo;Engineering Excellence in MEP Solutions&rdquo;
                    </p>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-6 rounded-xl border border-neutral-100 bg-white px-8 py-5 shadow-lg">
                  <p className="text-3xl font-extrabold text-[#080808]">2003</p>
                  <p className="text-[13px] font-semibold text-neutral-500">
                    Established
                  </p>
                </div>
              </div>
            </Animate>
          </div>
        </div>
      </section>

      {/* ── VISION & MISSION ── */}
      <section className="border-y border-neutral-100 bg-[#F7F7F8] py-20 lg:py-28">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-2">
            {[
              {
                label: "Our Vision",
                text: "To be recognized as the most trusted and innovative MEP contracting company in the UAE, setting benchmarks in engineering quality, safety, and client satisfaction.",
                anim: "fadeRight" as const,
              },
              {
                label: "Our Mission",
                text: "To deliver integrated, high-quality electromechanical solutions through skilled engineering, advanced technology, and unwavering commitment to safety, sustainability, and project excellence.",
                anim: "fadeLeft" as const,
              },
            ].map((item) => (
              <Animate key={item.label} animation={item.anim} delay={200}>
                <div className="rounded-2xl border border-neutral-100 bg-white p-10">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-[2px] w-6 bg-[#C0152A]" />
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#C0152A]">
                      {item.label}
                    </span>
                  </div>
                  <p className="text-lg leading-relaxed text-neutral-600">
                    {item.text}
                  </p>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <Animate animation="fadeUp">
            <SectionHeading
              eyebrow="Our Principles"
              title="Core"
              highlight="Values"
              center
            />
          </Animate>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Animate key={v.title} animation="fadeUp" delay={i * 100}>
                <div className="group rounded-xl border border-neutral-100 p-7 transition-all hover:-translate-y-1 hover:border-[#C0152A]/20 hover:shadow-lg">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 transition-colors group-hover:bg-[#C0152A]">
                    <v.icon className="h-5 w-5 text-[#C0152A] transition-colors group-hover:text-white" />
                  </div>
                  <h3 className="mb-2 text-[15px] font-bold text-[#080808]">
                    {v.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-neutral-500">
                    {v.desc}
                  </p>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <StatsCounter
        stats={[
          { value: 500, suffix: "+", label: "Projects Completed" },
          { value: 20, suffix: "+", label: "Years Experience" },
          { value: 200, suffix: "+", label: "Expert Engineers" },
          { value: 98, suffix: "%", label: "Client Satisfaction" },
        ]}
      />

      {/* ── CERTIFICATIONS ── */}
      <section className="border-t border-neutral-100 bg-[#F7F7F8] py-20 lg:py-28">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <Animate animation="fadeUp">
            <SectionHeading
              eyebrow="Accreditation"
              title="Certifications &"
              highlight="Compliance"
              center
            />
          </Animate>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                code: "ISO 9001:2015",
                title: "Quality Management",
                desc: "International quality management system certification.",
              },
              {
                code: "OHSAS 18001",
                title: "Health & Safety",
                desc: "Occupational health and safety management standard.",
              },
              {
                code: "DEWA",
                title: "DEWA Approved",
                desc: "Approved contractor by Dubai Electricity & Water Authority.",
              },
              {
                code: "UAE",
                title: "UAE Licensed",
                desc: "Fully licensed electromechanical contractor in the UAE.",
              },
            ].map((cert, i) => (
              <Animate key={cert.code} animation="scaleUp" delay={i * 100}>
                <div className="rounded-xl border border-neutral-100 bg-white p-7 text-center transition-all hover:-translate-y-1 hover:shadow-lg">
                  <p className="mb-3 font-mono text-2xl font-extrabold text-[#C0152A]">
                    {cert.code}
                  </p>
                  <h3 className="mb-1 text-sm font-bold text-[#080808]">
                    {cert.title}
                  </h3>
                  <p className="text-[13px] text-neutral-500">{cert.desc}</p>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}