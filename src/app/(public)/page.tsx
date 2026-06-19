import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Shield,
  Clock,
  Users,
  Award,
  Zap,
  Building2,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

import { connectDB } from "@/lib/mongodb";
import About from "@/models/About";
import Service from "@/models/Service";
import Project from "@/models/Project";
import Blog from "@/models/Blog";
import TeamMember from "@/models/TeamMember";
import Career from "@/models/Career";

import SectionHeading from "@/components/public/SectionHeading";
import StatsCounter from "@/components/public/StatsCounter";
import ServiceCard from "@/components/public/ServiceCard";
import ProjectCard from "@/components/public/ProjectCard";
import BlogCard from "@/components/public/BlogCard";
import TeamCard from "@/components/public/TeamCard";
import CTABanner from "@/components/public/CTABanner";
import ClientLogos from "@/components/public/ClientLogos";
import Testimonials from "@/components/public/Testimonials";
import Animate from "@/components/public/Animate";
import ImageCarousel from "@/components/public/ImageCarousel";
import ProjectCarousel from "@/components/public/ProjectCarousel";
import HeroMedia from "@/components/public/HeroMedia";
import ServiceShowcase from "@/components/public/ServiceShowcase";
import BrochureDownload from "@/components/public/BrochureDownload";
import VideoIntro from "@/components/public/VideoIntro";

export const revalidate = 3600;

export async function generateMetadata() {
  return {
    title:
      "Electrotech Electromechanical Contracting LLC | MEP Engineering UAE",
    description:
      "Delivering innovative, reliable, and high-performance electromechanical contracting solutions across the UAE.",
  };
}

// About carousel images — replace with actual project photos
const aboutImages = [
  {
    src: "/images/about/0.jpg",
    alt: "MEP Engineering",
    caption: "Integrated MEP Solutions",
  },
  {
    src: "/images/about/1.jpg",
    alt: "HVAC Installation",
    caption: "HVAC & Ventilation Systems",
  },
  {
    src: "/images/about/2.jpg",
    alt: "Electrical Systems",
    caption: "Electrical Power & Lighting",
  },
  {
    src: "/images/about/3.jpg",
    alt: "Fire Fighting",
    caption: "Fire Safety Systems",
  },
  {
    src: "/images/about/4.jpg",
    alt: "MEP Engineering",
    caption: "Integrated MEP Solutions",
  },
  {
    src: "/images/about/5.jpg",
    alt: "HVAC Installation",
    caption: "HVAC & Ventilation Systems",
  },
  {
    src: "/images/about/6.jpg",
    alt: "Electrical Systems",
    caption: "Electrical Power & Lighting",
  },
  {
    src: "/images/about/7.jpg",
    alt: "Fire Fighting",
    caption: "Fire Safety Systems",
  },
  {
    src: "/images/about/8.jpg",
    alt: "Electrical Systems",
    caption: "Electrical Power & Lighting",
  },
  {
    src: "/images/about/9.jpg",
    alt: "Fire Fighting",
    caption: "Fire Safety Systems",
  },
];

export default async function HomePage() {
  await connectDB();

  const [about, services, projects, blogs, team, openCareers] =
    await Promise.all([
      About.findOne().lean(),
      Service.find().sort({ order: 1 }).lean(),
      Project.find({ status: "published" })
        .sort({ createdAt: -1 })
        .limit(4)
        .lean(),
      Blog.find({ status: "published" })
        .sort({ publishDate: -1 })
        .limit(3)
        .lean(),
      TeamMember.find().sort({ order: 1 }).limit(4).lean(),
      Career.countDocuments({ status: "open" }),
    ]);

  const s = (data: any) => JSON.parse(JSON.stringify(data));

  return (
    <>
      <section className="relative flex min-h-screen items-center overflow-hidden bg-[#080808]">
        <HeroMedia />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/80 via-[#080808]/70 to-[#080808]/40" />

        {/* Grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(192,21,42,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(192,21,42,0.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "linear-gradient(to right, black 30%, transparent 70%)",
          }}
        />

        {/* Decorative circles */}
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full border border-[#C0152A]/10 animate-[spin_40s_linear_infinite]" />
        <div className="pointer-events-none absolute -bottom-16 left-16 h-[300px] w-[300px] rounded-full border border-dashed border-white/5 animate-[spin_25s_linear_infinite_reverse]" />

        <div className="relative z-10 mx-auto max-w-[1360px] px-6 py-32 lg:px-10">
          {/* Eyebrow */}
          <Animate animation="fadeRight" delay={200}>
            <div className="mb-8 flex items-center gap-4">
              <span className="h-[2px] w-12 bg-[#C0152A]" />
              <span className="font-mono text-[14px] font-semibold uppercase tracking-[0.15em] text-white/80">
                UAE&apos;s Premier MEP Engineering Company
              </span>
            </div>
          </Animate>

          {/* Headline */}
          <Animate animation="slideUp" delay={400}>
            <h1 className="max-w-3xl text-6xl font-extrabold leading-[0.9] tracking-tight text-white lg:text-8xl xl:text-9xl">
              Engineering
              <span className="relative ml-4 inline-block text-[#C0152A]">
                Excellence
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                >
                  <path
                    d="M0 10 Q75 0 150 6 T300 4"
                    stroke="#C0152A"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.4"
                  />
                </svg>
              </span>
              <span
                className="mt-2 block"
                style={{
                  WebkitTextStroke: "2px rgba(255,255,255,0.35)",
                  color: "transparent",
                }}
              >
                in MEP.
              </span>
            </h1>
          </Animate>

          {/* Subtitle */}
          <Animate animation="fadeUp" delay={600}>
            <p className="mt-8 max-w-[540px] text-xl leading-relaxed text-white/80">
              Delivering innovative, reliable, and high-performance
              electromechanical contracting solutions across residential,
              commercial, industrial, and infrastructure projects in the UAE.
            </p>
          </Animate>

          {/* CTA */}
          <Animate animation="fadeUp" delay={800}>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="group flex items-center gap-3 rounded-lg bg-[#C0152A] px-10 py-5 text-[15px] font-bold uppercase tracking-[0.06em] text-white transition-all hover:bg-[#960F20] hover:shadow-[0_8px_30px_rgba(192,21,42,0.4)]"
              >
                Get in Touch
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/projects"
                className="flex items-center gap-3 rounded-lg border-2 border-white/35 px-10 py-5 text-[15px] font-bold uppercase tracking-[0.06em] text-white transition-all hover:border-white/50 hover:bg-white/5"
              >
                View Projects <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </Animate>

          {/* Stats */}
          <Animate animation="fadeUp" delay={1000}>
            <div className="mt-16 flex flex-wrap gap-10 border-t border-white/[0.08] pt-10">
              {[
                { value: "500", suffix: "+", label: "Projects Completed" },
                { value: "20", suffix: "+", label: "Years Experience" },
                { value: "200", suffix: "+", label: "Expert Engineers" },
                { value: "98", suffix: "%", label: "Client Satisfaction" },
              ].map((stat) => (
                <div key={stat.label} className="group">
                  <p className="text-5xl font-black tracking-tight text-white transition-transform group-hover:-translate-y-1">
                    {stat.value}
                    <span className="text-3xl text-[#C0152A]">
                      {stat.suffix}
                    </span>
                  </p>
                  <p className="mt-2 text-[15px] font-semibold text-white/60">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Animate>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
          <div className="relative h-14 w-px overflow-hidden bg-white/15">
            <div className="absolute h-1/2 w-full animate-[scrollLine_2s_ease_infinite] bg-[#C0152A]" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
            Scroll
          </span>
        </div>

        <style>{`
          @keyframes scrollLine { 0% { transform: translateY(-100%); } 100% { transform: translateY(200%); } }
        `}</style>
      </section>

      {/* ═══════════════════════════
          2. MARQUEE
      ═══════════════════════════ */}
      <div className="relative overflow-hidden bg-[#080808] py-5">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#080808] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#080808] to-transparent" />
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C0152A]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C0152A]/40 to-transparent" />

        <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          {[...Array(3)].map((_, dup) => (
            <div key={dup} className="flex">
              {(services.length > 0
                ? services.map((s: any) => s.title)
                : [
                    "Electrical Systems",
                    "HVAC & Ventilation",
                    "Plumbing & Drainage",
                    "Fire Fighting",
                    "ELV Systems",
                    "Building Management",
                    "Testing & Commissioning",
                    "Maintenance",
                  ]
              ).map((name: string, i: number) => (
                <span
                  key={`${dup}-${i}`}
                  className="flex items-center gap-5 px-7"
                >
                  <span className="flex h-[6px] w-[6px] rounded-full bg-[#C0152A] shadow-[0_0_8px_rgba(192,21,42,0.5)]" />
                  <span className="text-[15px] font-bold uppercase tracking-[0.1em] text-white/80">
                    {name}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>

        <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }`}</style>
      </div>

      {/* ═══════════════════════════
          3. ABOUT — CAROUSEL + CONTENT
      ═══════════════════════════ */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left — Image Carousel */}
            <Animate animation="fadeRight" delay={200}>
              <div className="relative">
                <ImageCarousel images={aboutImages} autoPlay interval={5000} />

                {/* Floating stat badge */}
                <div className="absolute -bottom-5 -right-5 z-10 rounded-xl border border-neutral-100 bg-white px-7 py-4 shadow-xl">
                  <p className="text-3xl font-extrabold text-[#080808]">
                    500<span className="text-[#C0152A]">+</span>
                  </p>
                  <p className="text-[13px] font-semibold text-neutral-500">
                    MEP Projects Delivered
                  </p>
                </div>
              </div>
            </Animate>

            {/* Right — Content */}
            <div>
              <Animate animation="fadeUp">
                <SectionHeading
                  eyebrow="About Electrotech"
                  title="Building Engineering Solutions with"
                  highlight="Quality & Precision"
                />
              </Animate>

              <Animate animation="fadeUp" delay={200}>
                <p className="mt-6 text-[17px] leading-[1.8] text-neutral-700">
                  {about?.body ||
                    "Electrotech Electromechanical Contracting LLC is a specialized MEP contracting company delivering integrated engineering solutions across the UAE."}
                </p>
              </Animate>

              <Animate animation="fadeUp" delay={300}>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {[
                    "Quality Excellence",
                    "Integrity & Transparency",
                    "Innovation",
                    "Client Commitment",
                    "Safety First",
                    "Sustainability",
                  ].map((value) => (
                    <div
                      key={value}
                      className="group flex items-center gap-3 rounded-lg border border-neutral-100 px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-[#C0152A]/20 hover:bg-red-50/50 hover:shadow-sm"
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-[#C0152A] transition-transform group-hover:scale-150" />
                      <span className="text-[15px] font-bold text-neutral-800">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </Animate>

              <Animate animation="fadeUp" delay={400}>
                <div className="mt-8 flex gap-4">
                  <Link
                    href="/about"
                    className="group flex items-center gap-2 rounded-lg bg-[#C0152A] px-6 py-3 text-[15px] font-bold uppercase tracking-[0.06em] text-white transition-all hover:bg-[#960F20] hover:shadow-lg"
                  >
                    Learn More{" "}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </Animate>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          4. SERVICES
      ═══════════════════════════ */}
      {/* <section className="border-y border-neutral-100 bg-[#F7F7F8] py-20 lg:py-28">
          <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
            <Animate animation="fadeUp">
              <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
                <SectionHeading
                  eyebrow="What We Do"
                  title="Our Core"
                  highlight="Engineering Services"
                />
                <Link
                  href="/services"
                  className="flex items-center gap-2 text-[15px] font-bold text-neutral-600 transition hover:text-[#C0152A]"
                >
                  View All Services <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
            </Animate>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {(services.length > 0 ? s(services) : []).map(
                (service: any, i: number) => (
                  <Animate key={service._id} animation="fadeUp" delay={i * 100}>
                    <ServiceCard
                      title={service.title}
                      caption={service.caption}
                      slug={service.slug}
                      index={i}
                      thumbnail={service.thumbnail}
                    />
                  </Animate>
                ),
              )}
            </div>
          </div>
        </section> */}

      {/* ═══════════════════════════
          4. SERVICES — INTERACTIVE SHOWCASE
      ═══════════════════════════ */}
      <section className="border-y border-neutral-100 bg-[#F7F7F8] py-20 lg:py-28">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <Animate animation="fadeUp">
            <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="What We Do"
                title="Our Core"
                highlight="Engineering Services"
                description="From design and estimation to installation, testing, and commissioning — we deliver end-to-end electromechanical services."
              />
              <Link
                href="/services"
                className="flex items-center gap-2 rounded-lg border border-neutral-300 px-6 py-3 text-[14px] font-bold uppercase tracking-[0.06em] text-neutral-700 transition hover:border-neutral-500"
              >
                All Services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Animate>

          <Animate animation="fadeUp" delay={200}>
            <ServiceShowcase services={s(services)} />
          </Animate>
        </div>
      </section>

      {/* ═══════════════════════════
          5. WHY CHOOSE US
      ═══════════════════════════ */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <Animate animation="fadeUp">
            <SectionHeading
              eyebrow="Why Electrotech"
              title="Why Clients Choose"
              highlight="Electrotech"
              center
            />
          </Animate>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Users,
                num: "01",
                title: "Experienced Professionals",
                body: "200+ certified engineers with deep expertise across all MEP disciplines.",
              },
              {
                icon: CheckCircle,
                num: "02",
                title: "Proven Quality Assurance",
                body: "ISO-certified quality management ensuring consistent excellence.",
              },
              {
                icon: Clock,
                num: "03",
                title: "Timely Execution",
                body: "97% on-time completion rate across all project categories.",
              },
              {
                icon: Shield,
                num: "04",
                title: "Safety Standards",
                body: "HSE-compliant processes with proven zero-accident record.",
              },
              {
                icon: Award,
                num: "05",
                title: "Turnkey Solutions",
                body: "End-to-end MEP from design through testing and commissioning.",
              },
              {
                icon: Building2,
                num: "06",
                title: "Strong Portfolio",
                body: "500+ completed projects across all major UAE sectors.",
              },
            ].map((item, i) => (
              <Animate key={item.num} animation="fadeUp" delay={i * 100}>
                <div className="group rounded-xl border border-neutral-100 bg-white p-8 transition-all hover:-translate-y-2 hover:border-[#C0152A]/20 hover:shadow-xl">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 transition-all duration-300 group-hover:bg-[#C0152A] group-hover:shadow-lg group-hover:shadow-red-200">
                    <item.icon className="h-7 w-7 text-[#C0152A] transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <h3 className="mb-3 text-xl font-extrabold text-[#080808]">
                    {item.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-neutral-600">
                    {item.body}
                  </p>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          6. PROJECTS — FULL WIDTH CAROUSEL
      ═══════════════════════════ */}
      <section className="bg-[#080808]">
        <div className="mx-auto max-w-[1360px] px-6 pb-6 pt-20 lg:px-10 lg:pt-28">
          <Animate animation="fadeUp">
            <SectionHeading
              eyebrow="Our Work"
              title="Engineering Projects That"
              highlight="Define Excellence"
              light
            />
          </Animate>
        </div>

        <Animate animation="fadeIn" delay={200}>
          {projects.length > 0 ? (
            <ProjectCarousel projects={s(projects)} />
          ) : (
            <div className="mx-auto max-w-[1360px] px-6 pb-20 lg:px-10">
              <div className="flex h-60 items-center justify-center rounded-xl border border-white/10 text-white/40">
                Projects coming soon
              </div>
            </div>
          )}
        </Animate>
      </section>

      {/* ═══════════════════════════
          7. CLIENT LOGOS
      ═══════════════════════════ */}
      <ClientLogos />

      {/* ═══════════════════════════
          8. TESTIMONIALS
      ═══════════════════════════ */}
      <Testimonials />

      {/* ═══════════════════════════
          9. STATS
      ═══════════════════════════ */}
      <StatsCounter
        stats={[
          { value: 500, suffix: "+", label: "Projects Completed" },
          { value: 20, suffix: "+", label: "Years Experience" },
          { value: 200, suffix: "+", label: "Expert Engineers" },
          { value: 98, suffix: "%", label: "Client Satisfaction" },
        ]}
      />

      {/* ═══════════════════════════
          10. TEAM
      ═══════════════════════════ */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <Animate animation="fadeUp">
            <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="Our Leadership"
                title="Meet the"
                highlight="Engineering Team"
              />
              <Link
                href="/team"
                className="flex items-center gap-2 text-[15px] font-bold text-neutral-600 transition hover:text-[#C0152A]"
              >
                View Full Team <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </Animate>

          {team.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {s(team).map((member: any, i: number) => (
                <Animate key={member._id} animation="fadeUp" delay={i * 100}>
                  <TeamCard
                    name={member.name}
                    designation={member.designation}
                    caption={member.caption}
                    profileImage={member.profileImage}
                    layout="grid"
                  />
                </Animate>
              ))}
            </div>
          ) : (
            <div className="flex h-60 items-center justify-center rounded-xl border border-neutral-100 bg-[#F7F7F8] text-neutral-400">
              Team profiles coming soon
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════
          11. BLOGS
      ═══════════════════════════ */}
      <section className="border-t border-neutral-100 bg-[#F7F7F8] py-20 lg:py-28">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <Animate animation="fadeUp">
            <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="Engineering Insights"
                title="MEP Knowledge &"
                highlight="Industry Updates"
              />
              <Link
                href="/blogs"
                className="flex items-center gap-2 rounded-lg border border-neutral-200 px-6 py-3 text-[15px] font-bold uppercase tracking-[0.06em] text-neutral-700 transition hover:border-neutral-400"
              >
                All Articles <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </Animate>

          {blogs.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {s(blogs).map((blog: any, i: number) => (
                <Animate key={blog._id} animation="fadeUp" delay={i * 100}>
                  <BlogCard
                    title={blog.title}
                    caption={blog.caption}
                    slug={blog.slug}
                    thumbnail={blog.thumbnail}
                    publishDate={blog.publishDate}
                    featured={i === 0}
                  />
                </Animate>
              ))}
            </div>
          ) : (
            <div className="flex h-60 items-center justify-center rounded-xl border border-neutral-100 bg-white text-neutral-400">
              Blog articles coming soon
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════
          12. CAREERS
      ═══════════════════════════ */}
      <Animate animation="fadeUp">
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <SectionHeading
                eyebrow="Join Our Team"
                title="Build Your Future With"
                highlight="Electrotech"
                center
              />

              {openCareers > 0 && (
                <p className="mt-4 text-[16px] text-neutral-600">
                  <span className="font-bold text-[#C0152A]">
                    {openCareers}
                  </span>{" "}
                  open {openCareers === 1 ? "position" : "positions"} available
                </p>
              )}

              <Link
                href="/careers"
                className="mt-8 inline-flex items-center gap-3 rounded-lg bg-[#C0152A] px-10 py-5 text-[15px] font-bold uppercase tracking-[0.06em] text-white transition-all hover:bg-[#960F20] hover:shadow-lg"
              >
                View Open Positions <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </Animate>

      {/* ═══════════════════════════
          13. DOWNLOAD BROCHURE
      ═══════════════════════════ */}
      <BrochureDownload />

      {/* ═══════════════════════════
          14. CTA
      ═══════════════════════════ */}
      <CTABanner />
    </>
  );
}
