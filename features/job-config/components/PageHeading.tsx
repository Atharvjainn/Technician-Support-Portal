interface PageHeadingProps {
  title: string;
  description: string;
}

export function PageHeading({
  title,
  description,
}: PageHeadingProps) {
  return (
    <div className="space-y-2 text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        {title}
      </h1>

      <p className="text-zinc-400">
        {description}
      </p>
    </div>
  );
}