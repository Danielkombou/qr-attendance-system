import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { MembershipRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { badRequest } from "@/lib/server/api-utils";
import { applyAttendxSessionCookies } from "@/lib/server/session-cookies";

type BetterAuthSignInResponse = {
  user?: { id: string };
  token?: string;
};

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = body?.email as string | undefined;
  const password = body?.password as string | undefined;

  if (!email || !password) {
    return badRequest("email and password are required");
  }

  const origin = request.nextUrl.origin;
  const authResponse = await fetch(`${origin}/api/auth/sign-in/email`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: request.headers.get("cookie") ?? "",
    },
    body: JSON.stringify({
      email,
      password,
      rememberMe: true,
    }),
  });

  if (!authResponse.ok) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: authResponse.status },
    );
  }

  const signInData = (await authResponse.json()) as BetterAuthSignInResponse;
  const userId = signInData.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Sign in failed" }, { status: 500 });
  }

  const membership = await prisma.organizationMembership.findFirst({
    where: { userId, isActive: true },
    orderBy: { createdAt: "asc" },
  });

  if (!membership) {
    return NextResponse.json(
      { error: "No active organization membership found for this user" },
      { status: 403 },
    );
  }

  const response = NextResponse.json({
    ok: true,
    redirectTo:
      membership.role === MembershipRole.ADMIN ||
      membership.role === MembershipRole.OWNER
        ? "/admin/dashboard"
        : "/dashboard",
  });

  applyAttendxSessionCookies(response, {
    userId,
    organizationId: membership.organizationId,
    role: membership.role,
  });

  return response;
}
