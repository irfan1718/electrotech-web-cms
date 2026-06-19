import Link from "next/link";
import { ArrowRight, ImageIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  caption: string;
  slug: string;
  index: number;
  thumbnail?: string | null;
}

export default function ServiceCard({
  title,
  caption,
  slug,
  index,
  thumbnail,
}: ServiceCardProps) {
  return (
    <Link
      href={`/services/${slug}`}
      className="group overflow-hidden rounded-xl border border-neutral-100 bg-white transition-all hover:-translate-y-1 hover:border-neutral-200 hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#F7F7F8]">
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

        {/* Number badge */}
        <span className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 font-mono text-[11px] font-bold text-[#C0152A] backdrop-blur-sm">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Red bottom line on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] origin-left scale-x-0 bg-[#C0152A] transition-transform duration-300 group-hover:scale-x-100" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-[15px] font-bold text-[#080808] transition-colors group-hover:text-[#C0152A]">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-neutral-500">
          {caption}
        </p>

        <span className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[#C0152A] transition-all group-hover:gap-3">
          Learn More <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
