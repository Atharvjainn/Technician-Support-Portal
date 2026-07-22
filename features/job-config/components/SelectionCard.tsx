import { Check } from "lucide-react";
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
        "relative",
        selected && "border-primary ring-1 ring-primary"
      )}
    >
      {selected && (
        <span className="absolute right-4 top-4 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3" strokeWidth={3} />
        </span>
      )}

      <h3 className="font-display pr-6 font-semibold text-foreground">
        {title}
      </h3>

      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}