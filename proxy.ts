import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const jobConfigured = request.cookies.get("job_configured")?.value === "1";
  const prepCompleted = request.cookies.get("prep_completed")?.value === "1";

  if (pathname.startsWith("/prep") && !jobConfigured) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/activity") && !prepCompleted) {
    return NextResponse.redirect(new URL("/prep", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/prep/:path*", "/activity/:path*"],
};