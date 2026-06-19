interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  center?: boolean;
  light?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  center = false,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={center ? "text-center" : ""}>
      {/* Eyebrow */}
      <div
        className={`mb-4 flex items-center gap-3 ${
          center ? "justify-center" : ""
        }`}
      >
        <span
          className={`h-[1.5px] w-7 ${light ? "bg-white/50" : "bg-[#C0152A]"}`}
        />
        <span
          className={`font-mono text-[10.5px] uppercase tracking-[0.2em] ${
            light ? "text-white/70" : "text-[#C0152A]"
          }`}
        >
          {eyebrow}
        </span>
      </div>

      {/* Title */}
      <h2
        className={`text-3xl font-extrabold tracking-tight lg:text-4xl ${
          light ? "text-white" : "text-[#080808]"
        }`}
      >
        {title}{" "}
        {highlight && (
          <span className={light ? "text-white underline decoration-white/30 decoration-2 underline-offset-4" : "text-[#C0152A]"}>
            {highlight}
          </span>
        )}
      </h2>

      {description && (
        <p
          className={`mt-4 max-w-xl text-base leading-relaxed ${
            light ? "text-white/65" : "text-neutral-500"
          } ${center ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
