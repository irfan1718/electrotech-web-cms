interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-black">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-sm text-neutral-500">{description}</p>
        )}
      </div>

      {children}
    </div>
  );
}
