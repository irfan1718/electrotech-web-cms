import Link from "next/link";
import { MapPin, ArrowUpRight, ImageIcon } from "lucide-react";

interface ProjectCardProps {
  title: string;
  caption: string;
  slug: string;
  thumbnail?: string | null;
  category?: string;
  location?: string;
}

export default function ProjectCard({
  title,
  caption,
  slug,
  thumbnail,
  category,
  location,
}: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${slug}`}
      className="group overflow-hidden rounded-xl border border-neutral-100 bg-white transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-10 w-10 text-neutral-200" />
          </div>
        )}

        {category && (
          <span className="absolute left-4 top-4 rounded bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#C0152A] backdrop-blur-sm">
            {category}
          </span>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-[#C0152A]/0 transition-all group-hover:bg-[#C0152A]/10">
          <div className="flex h-12 w-12 scale-0 items-center justify-center rounded-full bg-[#C0152A] text-white transition-transform duration-300 group-hover:scale-100">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-bold text-[#080808]">{title}</h3>
        {location && (
          <p className="mt-1 flex items-center gap-1 text-xs text-neutral-400">
            <MapPin className="h-3 w-3" /> {location}
          </p>
        )}
        <p className="mt-2 text-[13px] leading-relaxed text-neutral-500">
          {caption}
        </p>
      </div>
    </Link>
  );
}
