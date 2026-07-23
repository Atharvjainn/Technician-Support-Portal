"use server";

import { cookies } from "next/headers";

interface ConfirmResult {
  success: boolean;
  error?: string;
}

/**
 * Route-guard boundary for Phase 2 -> Phase 3.
 *
 * Mirrors confirm-job-config.ts: the client store still owns
 * `completed` / `countdownStartedAt` for UI purposes, this action
 * only mints the httpOnly cookie `proxy.ts` checks before /activity
 * is allowed to render.
 *
 * Defense in depth: also requires `job_configured` to already be
 * set. Since this is a real server endpoint, someone could try to
 * call it directly to skip straight to Phase 3 without ever having
 * configured a job — checking the upstream cookie here means the
 * whole chain (job-config -> prep -> activity) has to be walked in
 * order, not just the immediately-preceding step.
 */
export async function confirmPrepCompleted(): Promise<ConfirmResult> {
  const cookieStore = await cookies();

  const jobConfigured = cookieStore.get("job_configured")?.value === "1";
  if (!jobConfigured) {
    return { success: false, error: "Job has not been configured yet." };
  }

  cookieStore.set("prep_completed", "1", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
  });

  return { success: true };
}

export async function clearPrepCompleted(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("prep_completed", "", { path: "/", maxAge: 0 });
}