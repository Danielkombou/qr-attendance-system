import { randomUUID } from "node:crypto";
import { InvitationStatus, MembershipRole } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, requireAdminRole, requireContext } from "@/lib/server/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> },
) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const adminGuard = requireAdminRole(context.role);
  if (adminGuard) return adminGuard;

  const { orgId } = await params;
  const invitations = await prisma.invitation.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ invitations });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> },
) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const adminGuard = requireAdminRole(context.role);
  if (adminGuard) return adminGuard;

  const { orgId } = await params;
  const body = await request.json().catch(() => null);
  const email = body?.email as string | undefined;
  const role = (body?.role as MembershipRole | undefined) ?? MembershipRole.EMPLOYEE;

  if (!email) {
    return badRequest("Invite email is required");
  }

  const invitation = await prisma.invitation.create({
    data: {
      organizationId: orgId,
      email,
      role,
      token: randomUUID(),
      status: InvitationStatus.PENDING,
      invitedById: context.userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  return NextResponse.json(
    {
      invitation,
      inviteUrl: `/get-started?inviteToken=${invitation.token}`,
    },
    { status: 201 },
  );
}
