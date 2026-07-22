import { SAFETY_INSTRUCTIONS } from "../constants/safety";
import { Card } from "@/ui/Card";

export function SafetyInstructions() {
  return (
    <div className="space-y-3">
      <h2 className="font-display text-lg font-semibold text-foreground">
        Safety Instructions
      </h2>

      <Card className="p-5">
        <ul className="space-y-3">
          {SAFETY_INSTRUCTIONS.map((instruction, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-muted text-xs font-semibold text-primary">
                {index + 1}
              </span>
              <span className="text-sm text-foreground">{instruction}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}