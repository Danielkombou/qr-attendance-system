import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest } from "@/lib/server/api-utils";
import { getRequestContext } from "@/lib/server/request-context";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const message = (body?.message as string | undefined)?.trim();

  if (!message || message.length < 3) {
    return badRequest("message is required (min 3 characters)");
  }
  if (message.length > 2000) {
    return badRequest("message is too long");
  }

  const context = getRequestContext(request);
  const feedback = await prisma.feedback.create({
    data: {
      message,
      userId: context.userId || null,
    },
  });

  return NextResponse.json({ feedback: { id: feedback.id } }, { status: 201 });
}
