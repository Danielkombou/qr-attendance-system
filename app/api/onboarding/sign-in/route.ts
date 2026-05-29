import { Role } from "@/lib/roles";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { badRequest } from "@/lib/server/api-utils";
import { authErrorResponse } from "@/lib/server/auth-errors";
import { applyAttendxSessionCookies } from "@/lib/server/session-cookies";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = body?.email as string | undefined;
  const password = body?.password as string | undefined;

  if (!email || !password) {
    return badRequest("email and password are required");
  }

  let userId: string | undefined;
  try {
    const result = await auth.api.signInEmail({
      body: { email, password, rememberMe: true },
      headers: request.headers,
    });
    userId = result?.user?.id;
  } catch (error) {
    return authErrorResponse(error, "Invalid credentials", 401);
  }

  if (!userId) {
    return NextResponse.json({ error: "Sign in failed" }, { status: 500 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  const role = user?.role ?? Role.USER;
  const response = NextResponse.json({
    ok: true,
    redirectTo: role === Role.ADMIN ? "/admin/dashboard" : "/dashboard",
  });

  applyAttendxSessionCookies(response, { userId, role });
  return response;
}
