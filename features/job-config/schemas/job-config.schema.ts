import { z } from "zod";
import { EQUIPMENT } from "../constants/equipments";
import { SEVERITY } from "../constants/severity";

const equipmentIds = EQUIPMENT.map((e) => e.id) as [string, ...string[]];
const severityIds = SEVERITY.map((s) => s.id) as [string, ...string[]];

export const EquipmentId = z.enum(equipmentIds);
export const SeverityId = z.enum(severityIds);

export const JobConfigSchema = z.object({
  equipment: EquipmentId,
  severity: SeverityId,
});

export type ValidJobConfig = z.infer<typeof JobConfigSchema>;

export function validateJobConfig(
  data: unknown
): ValidJobConfig | null {
  const result = JobConfigSchema.safeParse(data);
  return result.success ? result.data : null;
}
