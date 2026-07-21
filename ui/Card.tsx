// shared/ui/Card/Card.tsx

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-zinc-800 bg-zinc-300 p-6 transition-all duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}