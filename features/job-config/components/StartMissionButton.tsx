import { ArrowRight } from "lucide-react";
import { Button } from "@/ui/Button";

interface StartMissionButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export function StartMissionButton({
  disabled,
  onClick,
}: StartMissionButtonProps) {
  return (
    <div className="flex justify-end">
      <Button disabled={disabled} onClick={onClick}>
        Start Mission
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}