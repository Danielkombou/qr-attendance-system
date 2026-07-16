import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { initialsFromName, employeeId } from "@/lib/format/display";
import { prisma } from "@/lib/prisma";
import { badRequest, requireContext } from "@/lib/server/api-utils";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 120_000;

export async function PATCH(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (!context) return error;

  const body = await request.json().catch(() => null);
  const image = body?.image as string | undefined;

  if (!image || !image.startsWith("data:image/")) {
    return badRequest("image must be a data URL");
  }
  if (image.length > MAX_IMAGE_BYTES) {
    return badRequest("Image is too large (max ~90KB)");
  }

  const user = await prisma.user.update({
    where: { id: context.userId },
    data: { image },
    select: { id: true, name: true, email: true, role: true, image: true, createdAt: true },
  });

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      initials: initialsFromName(user.name),
      employeeId: employeeId(user.id, user.createdAt),
    },
  });
}
