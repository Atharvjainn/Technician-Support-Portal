"use server";

import { cookies } from "next/headers";
import { validateJobConfig } from "../schemas/job-config.schema";

interface ConfirmResult {
  success: boolean;
  error?: string;
}

export async function confirmJobConfigured(
  equipment: string,
  severity: string
): Promise<ConfirmResult> {
  const valid = validateJobConfig({ equipment, severity });

  if (!valid) {
    return { success: false, error: "Invalid job configuration." };
  }

  const cookieStore = await cookies();
  cookieStore.set("job_configured", "1", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
  });

  return { success: true };
}

/**
 * Clears the guard cookie when the mission is reset (e.g. the user
 * navigates back to Phase 1 and changes their selection, or the
 * client-side guards in ActivityView/PrepView detect an invalid
 * state and reset the stores). Keeping this server-side too avoids
 * a stale httpOnly cookie outliving a client-side reset.
 */
export async function clearJobConfigured(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("job_configured", "", { path: "/", maxAge: 0 });
}