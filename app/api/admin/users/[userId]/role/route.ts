import { Role } from "@/lib/roles";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, forbidden, requireAdminRole, requireContext } from "@/lib/server/api-utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const adminGuard = requireAdminRole(context.role);
  if (adminGuard) return adminGuard;

  const { userId } = await params;
  const body = await request.json().catch(() => null);
  const role = body?.role as Role | undefined;

  if (role !== Role.ADMIN && role !== Role.USER) {
    return badRequest('role must be "ADMIN" or "USER"');
  }

  const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } });
  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (target.id === context.userId && role === Role.USER) {
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

  return NextResponse.json({ user });
}
