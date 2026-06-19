import Link from "next/link";
import { Calendar, ImageIcon } from "lucide-react";

interface BlogCardProps {
  title: string;
  caption: string;
  slug: string;
  thumbnail?: string | null;
  publishDate?: string;
  featured?: boolean;
}

export default function BlogCard({
  title,
  caption,
  slug,
  thumbnail,
  publishDate,
  featured = false,
}: BlogCardProps) {
  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <Link
      href={`/blogs/${slug}`}
      className="group overflow-hidden border border-neutral-200 bg-white transition-all hover:border-[#C0152A]/20 hover:shadow-lg"
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden bg-neutral-100 ${
          featured ? "aspect-[16/10]" : "aspect-video"
        }`}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-100">
            <ImageIcon className="h-10 w-10 text-neutral-300" />
          </div>
        )}
        {/* Red corner accent */}
        <div className="absolute right-0 top-0 h-0 w-0 border-b-[32px] border-l-[32px] border-b-transparent border-l-[#C0152A] opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="p-6">
        {formattedDate && (
          <div className="mb-3 flex items-center gap-1.5 font-mono text-[11px] text-neutral-400">
            <Calendar className="h-3.5 w-3.5" />
            {formattedDate}
          </div>
        )}

        <h3
          className={`font-bold leading-tight text-neutral-900 transition-colors group-hover:text-[#C0152A] ${
            featured ? "text-xl" : "text-base"
          }`}
        >
          {title}
        </h3>

        <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
          {caption}
        </p>
      </div>
    </Link>
  );
}
