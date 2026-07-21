import { Card } from "@/ui/Card";
import { cn } from "@/lib/utils";

interface SelectionCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export function SelectionCard({
  title,
  description,
  selected,
  onClick,
}: SelectionCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all hover:border-blue-500",
        selected
          ? "border-blue-500 bg-blue-500/10"
          : "border-zinc-100"
      )}
    >
      <h3 className="font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm text-zinc-400">
        {description}
      </p>
    </Card>
  );
}