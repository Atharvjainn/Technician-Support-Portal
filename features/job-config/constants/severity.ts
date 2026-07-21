import { ConfigOption } from "../types/job-config.types";

export const SEVERITY: ConfigOption[] = [
  {
    id: "routine",
    title: "Routine Maintenance",
    description: "Scheduled servicing",
  },
  {
    id: "critical",
    title: "Critical Fault",
    description: "Immediate attention required",
  },
];