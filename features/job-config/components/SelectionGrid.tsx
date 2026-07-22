import { ConfigOption } from "../types/job-config.types";
import { SelectionCard } from "./SelectionCard";
import { Section } from "@/ui/Section";

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
    <Section title={title}>
      <div className="grid gap-4 md:grid-cols-3">
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
    </Section>
  );
}