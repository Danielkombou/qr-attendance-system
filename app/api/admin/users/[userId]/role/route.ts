import { Role } from "@/lib/roles";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, forbidden, requireAdminContext } from "@/lib/server/api-utils";
import { applyAttendxSessionCookies } from "@/lib/server/session-cookies";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { error, context } = await requireAdminContext(request);
  if (!context) return error;

  const { userId } = await params;
  const body = await request.json().catch(() => null);
  const role = body?.role as Role | undefined;

  if (role !== Role.ADMIN && role !== Role.USER) {
    return badRequest('role must be "ADMIN" or "USER"');
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isSelf = target.id === context.userId;

  if (isSelf && role === Role.USER) {
    const adminCount = await prisma.user.count({ where: { role: Role.ADMIN } });
    if (adminCount <= 1) {
      return forbidden("Cannot remove the last admin");
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });

  const redirectTo = isSelf
    ? role === Role.ADMIN
      ? "/admin/dashboard"
      : "/dashboard"
    : null;

  const response = NextResponse.json({ user, redirectTo });

  // Keep the signed-in admin's role cookie in sync when changing their own role.
  if (isSelf) {
    applyAttendxSessionCookies(response, { userId: user.id, role: user.role });
  }

  return response;
}
