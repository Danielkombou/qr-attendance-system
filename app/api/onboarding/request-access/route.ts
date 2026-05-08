import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JoinRequestStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { badRequest } from "@/lib/server/api-utils";
import { getRequestContext } from "@/lib/server/request-context";

export async function POST(request: NextRequest) {
  const context = getRequestContext(request);
  if (!context.userId) {
    return NextResponse.json({ error: "Missing user context" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const organizationSlug = body?.organizationSlug as string | undefined;
  const message = (body?.message as string | undefined) ?? "";

  if (!organizationSlug) {
    return badRequest("organizationSlug is required");
  }

  const organization = await prisma.organization.findUnique({ where: { slug: organizationSlug } });
  if (!organization) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  const requestRecord = await prisma.organizationJoinRequest.create({
    data: {
      userId: context.userId,
      organizationId: organization.id,
      status: JoinRequestStatus.PENDING,
      message,
    },
  });

  return NextResponse.json({ request: requestRecord }, { status: 201 });
}
