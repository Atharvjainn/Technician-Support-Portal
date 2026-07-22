// shared/ui/Section/Section.tsx

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ title, eyebrow, children, className }: SectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="space-y-1">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-lg font-semibold text-foreground">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}