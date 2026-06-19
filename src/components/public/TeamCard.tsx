interface TeamCardProps {
  name: string;
  designation: string;
  caption: string;
  profileImage?: string | null;
  layout?: "grid" | "wide";
}

export default function TeamCard({
  name,
  designation,
  caption,
  profileImage,
  layout = "grid",
}: TeamCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  /* ── WIDE LAYOUT — used on Team page ── */
  if (layout === "wide") {
    return (
      <div className="group flex gap-6 rounded-xl border border-neutral-100 bg-white p-5 transition-all hover:-translate-y-1 hover:border-neutral-200 hover:shadow-lg">
        {/* Photo */}
        <div className="relative h-[140px] w-[120px] shrink-0 overflow-hidden rounded-lg bg-[#F7F7F8]">
          {profileImage ? (
            <img
              src={profileImage}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-3xl font-extrabold text-neutral-200">
                {initials}
              </span>
            </div>
          )}

          {/* Red accent corner */}
          <div className="absolute bottom-0 right-0 h-5 w-5 bg-[#C0152A] transition-all group-hover:h-7 group-hover:w-7" />
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col justify-center">
          <h3 className="text-lg font-extrabold tracking-tight text-[#080808]">
            {name}
          </h3>
          <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#C0152A]">
            {designation}
          </p>
          <div className="mt-1.5 h-[2px] w-8 bg-[#C0152A]/20" />
          <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-neutral-500">
            {caption}
          </p>
        </div>
      </div>
    );
  }

  /* ── GRID LAYOUT — used on Home page ── */
  return (
    <div className="group flex items-center gap-5 rounded-xl border border-neutral-100 bg-white p-4 transition-all hover:-translate-y-1 hover:border-neutral-200 hover:shadow-lg">
      {/* Photo */}
      <div className="relative h-[80px] w-[80px] shrink-0 overflow-hidden rounded-lg bg-[#F7F7F8]">
        {profileImage ? (
          <img
            src={profileImage}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xl font-extrabold text-neutral-200">
              {initials}
            </span>
          </div>
        )}

        {/* Red accent corner */}
        <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-[#C0152A]" />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-bold tracking-tight text-[#080808]">
          {name}
        </h3>
        <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#C0152A]">
          {designation}
        </p>
        <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-neutral-400">
          {caption}
        </p>
      </div>
    </div>
  );
}
