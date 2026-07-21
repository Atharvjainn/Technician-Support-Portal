import { SAFETY_INSTRUCTIONS } from "../constants/safety";

export function SafetyInstructions() {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Safety Instructions</h2>

      <ul className="space-y-2">
        {SAFETY_INSTRUCTIONS.map((instruction, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="mt-0.5 size-5 shrink-0 rounded-full bg-blue-500/20 text-center text-xs leading-5 text-blue-400">
              {index + 1}
            </span>
            <span className="text-zinc-300">{instruction}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
