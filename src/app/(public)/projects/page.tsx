import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import PageHero from "@/components/public/PageHero";
import ProjectCard from "@/components/public/ProjectCard";
import CTABanner from "@/components/public/CTABanner";
import ProjectsFilter from "@/components/public/ProjectsFilter";
import Animate from "@/components/public/Animate";

export const revalidate = 3600;

export async function generateMetadata() {
  return {
    title: "Our Projects | Electrotech MEP",
    description:
      "Explore our portfolio of MEP engineering projects across the UAE.",
  };
}

export default async function ProjectsPage() {
  await connectDB();
  const projects = await Project.find({ status: "published" })
    .sort({ createdAt: -1 })
    .lean();
  const data = JSON.parse(JSON.stringify(projects));

  const categories: string[] = [
    ...new Set<string>(
      data
        .map((p: any) => p.category)
        .filter((c: unknown): c is string => typeof c === "string"),
    ),
  ];

  const statuses: string[] = [
    ...new Set<string>(
      data
        .map((p: any) => p.projectStatus)
        .filter((s: unknown): s is string => typeof s === "string"),
    ),
  ];

  return (
    <>
      <PageHero
        title="Our Projects"
        subtitle="Explore our portfolio of MEP engineering projects across the UAE."
        breadcrumbs={[{ label: "Projects" }]}
        image="/images/hero-section/project.png"
      />

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <Animate animation="fadeUp">
            <ProjectsFilter
              projects={data}
              categories={categories}
              statuses={statuses}
            />
          </Animate>
        </div>
      </section>

      <CTABanner />
    </>
  );
}