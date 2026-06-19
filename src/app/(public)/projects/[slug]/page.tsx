import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import PageHero from "@/components/public/PageHero";
import ProjectCard from "@/components/public/ProjectCard";
import CTABanner from "@/components/public/CTABanner";
import ImageGallery from "@/components/public/ImageGallery";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connectDB();
  const { slug } = await params;
  const project = await Project.findOne({ slug, status: "published" }).lean();
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} | Electrotech Projects`,
    description: project.caption,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connectDB();
  const { slug } = await params;
  const project = await Project.findOne({ slug, status: "published" }).lean();

  if (!project) notFound();

  const related = await Project.find({
    status: "published",
    slug: { $ne: slug },
    ...(project.category ? { category: project.category } : {}),
  })
    .limit(3)
    .lean();

  const data = JSON.parse(JSON.stringify(project));
  const relatedData = JSON.parse(JSON.stringify(related));

  return (
    <>
      <PageHero
        title={data.title}
        subtitle={data.caption}
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: data.title },
        ]}
      />

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          {/* Meta info */}
          <div className="mb-10 flex flex-wrap gap-3">
            {data.category && (
              <span className="rounded-full bg-red-50 px-4 py-1.5 text-[12px] font-semibold text-[#C0152A]">
                {data.category}
              </span>
            )}
            {data.location && (
              <span className="flex items-center gap-1 rounded-full border border-neutral-200 px-4 py-1.5 text-[12px] text-neutral-500">
                <MapPin className="h-3 w-3" /> {data.location}
              </span>
            )}
            {data.projectStatus && (
              <span className="rounded-full border border-neutral-200 px-4 py-1.5 text-[12px] font-medium capitalize text-neutral-500">
                {data.projectStatus.replace("-", " ")}
              </span>
            )}
            {data.tags?.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full border border-neutral-200 px-4 py-1.5 text-[12px] text-neutral-400"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Thumbnail */}
          {data.thumbnail && (
            <img
              src={data.thumbnail}
              alt={data.title}
              className="mb-10 w-full rounded-xl border border-neutral-100 object-cover"
            />
          )}

          {/* Body */}
          <div className="mx-auto max-w-3xl">
            <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-neutral-600">
              {data.body}
            </div>

            {data.detailBody && (
              <div className="mt-8 whitespace-pre-wrap text-[15px] leading-relaxed text-neutral-600">
                {data.detailBody}
              </div>
            )}
          </div>

          {/* Gallery */}
          {data.images?.length > 0 && (
            <div className="mt-14">
              <ImageGallery images={data.images} title={data.title} />
            </div>
          )}
        </div>
      </section>

      {/* Related */}
      {relatedData.length > 0 && (
        <section className="border-t border-neutral-100 bg-[#F7F7F8] py-20 lg:py-28">
          <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
            <h2 className="mb-10 text-2xl font-extrabold text-[#080808]">
              Related Projects
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedData.map((p: any) => (
                <ProjectCard
                  key={p._id}
                  title={p.title}
                  caption={p.caption}
                  slug={p.slug}
                  thumbnail={p.thumbnail}
                  category={p.category}
                  location={p.location}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABanner />
    </>
  );
}
