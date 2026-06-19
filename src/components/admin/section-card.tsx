interface SectionCardProps {
  title?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

export default function SectionCard({
  title,
  headerRight,
  children,
}: SectionCardProps) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
      {(title || headerRight) && (
        <div className="mb-6 flex items-center justify-between">
          {title && <h2 className="text-lg font-bold text-black">{title}</h2>}

          {headerRight}
        </div>
      )}

      {children}
    </div>
  );
}
