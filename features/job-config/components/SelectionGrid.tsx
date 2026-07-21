import { ConfigOption } from "../types/job-config.types";
import { SelectionCard } from "./SelectionCard";

interface SelectionGridProps {
  title: string;

  options: ConfigOption[];

  selectedId: string;

  onSelect: (id: string) => void;
}

export function SelectionGrid({
  title,
  options,
  selectedId,
  onSelect,
}: SelectionGridProps) {
  return (
    <section className="space-y-5">
      <h2 className="text-xl font-semibold">
        {title}
      </h2>

      <div className="grid gap-5 md:grid-cols-3">
        {options.map((option) => (
          <SelectionCard
            key={option.id}
            title={option.title}
            description={option.description}
            selected={selectedId === option.id}
            onClick={() => onSelect(option.id)}
          />
        ))}
      </div>
    </section>
  );
}