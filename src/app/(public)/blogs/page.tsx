import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import PageHero from "@/components/public/PageHero";
import BlogCard from "@/components/public/BlogCard";
import CTABanner from "@/components/public/CTABanner";
import Animate from "@/components/public/Animate";

export const revalidate = 3600;

export async function generateMetadata() {
  return {
    title: "Blog & Insights | Electrotech MEP",
    description:
      "Engineering insights, MEP industry updates, and technical knowledge from Electrotech.",
  };
}

export default async function BlogsPage() {
  await connectDB();
  const blogs = await Blog.find({ status: "published" })
    .sort({ publishDate: -1 })
    .lean();
  const data = JSON.parse(JSON.stringify(blogs));

  return (
    <>
      <PageHero
        title="Blog & Insights"
        subtitle="Engineering knowledge, MEP industry updates, and technical insights."
        breadcrumbs={[{ label: "Blogs" }]}
        image="/images/hero-section/blog.png"
      />

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          {data.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((blog: any, i: number) => (
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
            <div className="flex h-60 items-center justify-center rounded-xl border border-neutral-100 bg-[#F7F7F8] text-neutral-400">
              Blog articles coming soon
            </div>
          )}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
