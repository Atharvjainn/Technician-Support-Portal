import { ArrowRight } from "lucide-react";
import { Button } from "@/ui/Button";

interface StartMissionButtonProps {
  disabled: boolean;
  onClick: () => void;
  pending?: boolean;
}

export function StartMissionButton({
  disabled,
  onClick,
  pending,
}: StartMissionButtonProps) {
  return (
    <div className="flex justify-end">
      <Button disabled={disabled} onClick={onClick}>
        {pending ? "Starting…" : "Start Mission"}
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}