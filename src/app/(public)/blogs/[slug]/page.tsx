import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import PageHero from "@/components/public/PageHero";
import BlogCard from "@/components/public/BlogCard";
import ImageGallery from "@/components/public/ImageGallery";
import CTABanner from "@/components/public/CTABanner";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connectDB();
  const { slug } = await params;
  const blog = await Blog.findOne({ slug, status: "published" }).lean();
  if (!blog) return { title: "Article Not Found" };
  return {
    title: `${blog.title} | Electrotech Blog`,
    description: blog.caption,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connectDB();
  const { slug } = await params;
  const blog = await Blog.findOne({ slug, status: "published" }).lean();

  if (!blog) notFound();

  const related = await Blog.find({ status: "published", slug: { $ne: slug } })
    .sort({ publishDate: -1 })
    .limit(3)
    .lean();

  const data = JSON.parse(JSON.stringify(blog));
  const relatedData = JSON.parse(JSON.stringify(related));

  const formattedDate = data.publishDate
    ? new Date(data.publishDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <>
      <PageHero
        title={data.title}
        subtitle={data.caption}
        breadcrumbs={[
          { label: "Blogs", href: "/blogs" },
          { label: data.title },
        ]}
      />

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          {formattedDate && (
            <div className="mb-8 flex items-center gap-2 text-sm text-neutral-400">
              <Calendar className="h-5 w-5" /> Published {formattedDate}
            </div>
          )}

          {data.thumbnail && (
            <img
              src={data.thumbnail}
              alt={data.title}
              className="mb-10 w-full rounded-xl border border-neutral-100 object-cover"
            />
          )}

          <div className="whitespace-pre-wrap text-[15px] leading-[1.85] text-neutral-600">
            {data.body}
          </div>

          {data.detailBody && (
            <div className="mt-8 whitespace-pre-wrap text-[15px] leading-[1.85] text-neutral-600">
              {data.detailBody}
            </div>
          )}

          {data.images?.length > 0 && (
            <div className="mt-12">
              <ImageGallery images={data.images} title={data.title} />
            </div>
          )}
        </div>
      </section>

      {relatedData.length > 0 && (
        <section className="border-t border-neutral-100 bg-[#F7F7F8] py-20 lg:py-28">
          <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
            <h2 className="mb-10 text-2xl font-extrabold text-[#080808]">
              More Articles
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedData.map((b: any) => (
                <BlogCard
                  key={b._id}
                  title={b.title}
                  caption={b.caption}
                  slug={b.slug}
                  thumbnail={b.thumbnail}
                  publishDate={b.publishDate}
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
