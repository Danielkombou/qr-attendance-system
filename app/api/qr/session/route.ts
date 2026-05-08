import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, requireAdminRole, requireContext } from "@/lib/server/api-utils";
import { createQRToken } from "@/lib/server/qr-token";

export async function POST(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const adminGuard = requireAdminRole(context.role);
  if (adminGuard) return adminGuard;

  const body = await request.json().catch(() => null);
  const siteId = body?.siteId as string | undefined;
  const ttlSeconds = Number(body?.ttlSeconds ?? 45);

  if (!siteId) return badRequest("siteId is required");

  const site = await prisma.site.findFirst({
    where: { id: siteId, organizationId: context.organizationId, isActive: true },
  });

  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const { token, tokenHash, nonce, issuedAt, expiresAt } = createQRToken(
    context.organizationId,
    siteId,
    ttlSeconds,
  );

  await prisma.dynamicQRSession.create({
    data: {
      organizationId: context.organizationId,
      siteId,
      tokenHash,
      nonce,
      issuedAt: new Date(issuedAt),
      expiresAt: new Date(expiresAt),
    },
  });

  return NextResponse.json({
    token,
    expiresAt,
    site: { id: site.id, name: site.name },
  });
}
