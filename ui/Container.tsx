// shared/ui/Container/Container.tsx

import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

export function Container({ children }: ContainerProps) {
  return <div className="mx-auto max-w-6xl px-6">{children}</div>;
}