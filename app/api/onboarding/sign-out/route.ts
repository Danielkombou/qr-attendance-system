import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { authErrorResponse } from "@/lib/server/auth-errors";
import { clearAttendxSessionCookies } from "@/lib/server/session-cookies";

export async function POST(request: NextRequest) {
  try {
    await auth.api.signOut({
      headers: request.headers,
    });
  } catch (error) {
    return authErrorResponse(error, "Unable to sign out", 500);
  }

  const response = NextResponse.json({ ok: true });
  clearAttendxSessionCookies(response);
  return response;
}
