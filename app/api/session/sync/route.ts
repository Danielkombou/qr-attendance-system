import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/roles";
import { requireContext } from "@/lib/server/api-utils";
import { applyAttendxSessionCookies } from "@/lib/server/session-cookies";

export const runtime = "nodejs";

/** Re-sync attendx_role cookie from the database (fixes stale role after promote/demote). */
export async function POST(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const user = await prisma.user.findUnique({
    where: { id: context.userId },
    select: { id: true, role: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const cookieUpdated = context.role !== user.role;
  const redirectTo = user.role === Role.ADMIN ? "/admin/dashboard" : "/dashboard";
  const response = NextResponse.json({
    role: user.role,
    cookieUpdated,
    redirectTo,
  });

  if (cookieUpdated) {
    applyAttendxSessionCookies(response, { userId: user.id, role: user.role });
  }

  return response;
}
