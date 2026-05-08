import { InvitationStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest } from "@/lib/server/api-utils";
import { getRequestContext } from "@/lib/server/request-context";

export async function POST(request: NextRequest) {
  const context = getRequestContext(request);
  if (!context.userId) {
    return NextResponse.json({ error: "Missing user context" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const token = body?.token as string | undefined;
  if (!token) return badRequest("Invitation token is required");

  const invite = await prisma.invitation.findUnique({ where: { token } });
  if (!invite) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }

  if (invite.expiresAt.getTime() < Date.now()) {
    await prisma.invitation.update({
      where: { id: invite.id },
      data: { status: InvitationStatus.EXPIRED },
    });
    return NextResponse.json({ error: "Invitation expired" }, { status: 410 });
  }

  const membership = await prisma.organizationMembership.upsert({
    where: {
      userId_organizationId: {
        userId: context.userId,
        organizationId: invite.organizationId,
      },
    },
    update: {
      role: invite.role,
      isActive: true,
    },
    create: {
      userId: context.userId,
      organizationId: invite.organizationId,
      role: invite.role,
      isActive: true,
    },
  });

  await prisma.invitation.update({
    where: { id: invite.id },
    data: {
      status: InvitationStatus.ACCEPTED,
      recipientId: context.userId,
    },
  });

  return NextResponse.json({ membership });
}
