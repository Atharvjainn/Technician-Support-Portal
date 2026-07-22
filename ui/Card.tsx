// shared/ui/Card/Card.tsx

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border border-border bg-card p-6 transition-all duration-200",
        onClick && "cursor-pointer hover:border-foreground/20 hover:shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}