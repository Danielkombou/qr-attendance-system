import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/roles";
import { forbidden, requireAdminRole, requireContext } from "@/lib/server/api-utils";

export const runtime = "nodejs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const adminGuard = requireAdminRole(context.role);
  if (adminGuard) return adminGuard;

  const { userId } = await params;

  if (userId === context.userId) {
    return forbidden("Cannot delete your own account");
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (target.role === Role.ADMIN) {
    const adminCount = await prisma.user.count({ where: { role: Role.ADMIN } });
    if (adminCount <= 1) {
      return forbidden("Cannot delete the last admin");
    }
  }

  await prisma.user.delete({ where: { id: userId } });

  return NextResponse.json({ ok: true });
}
