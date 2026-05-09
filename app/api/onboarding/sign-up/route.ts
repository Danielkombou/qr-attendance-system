import { JoinRequestStatus } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest } from "@/lib/server/api-utils";

type BetterAuthSignUpResponse = {
  user?: { id: string };
  token?: string | null;
};

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const name = body?.name as string | undefined;
  const email = body?.email as string | undefined;
  const password = body?.password as string | undefined;
  const organizationSlug = body?.organizationSlug as string | undefined;
  const joinMessage = (body?.joinMessage as string | undefined) ?? "";

  if (!name || !email || !password) {
    return badRequest("name, email, and password are required");
  }

  const origin = request.nextUrl.origin;
  let signUpData: BetterAuthSignUpResponse;
  try {
    const authResponse = await axios.post<BetterAuthSignUpResponse>(
      `${origin}/api/auth/sign-up/email`,
      {
        name,
        email,
        password,
        rememberMe: true,
      },
      {
        headers: {
          "content-type": "application/json",
          cookie: request.headers.get("cookie") ?? "",
        },
        validateStatus: () => true,
      },
    );

    if (authResponse.status < 200 || authResponse.status >= 300) {
      return NextResponse.json(
        { error: "Unable to create account" },
        { status: authResponse.status },
      );
    }

    signUpData = authResponse.data;
  } catch (error) {
    const status = error instanceof AxiosError ? (error.response?.status ?? 500) : 500;
    return NextResponse.json(
      { error: "Unable to create account" },
      { status },
    );
  }

  const userId = signUpData.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Sign up failed" }, { status: 500 });
  }

  let requestedOrganizationId: string | null = null;
  if (organizationSlug) {
    const organization = await prisma.organization.findUnique({
      where: { slug: organizationSlug },
      select: { id: true },
    });

    if (organization) {
      requestedOrganizationId = organization.id;
      await prisma.organizationJoinRequest.create({
        data: {
          userId,
          organizationId: organization.id,
          status: JoinRequestStatus.PENDING,
          message: joinMessage,
        },
      });
    }
  }

  return NextResponse.json({
    ok: true,
    userId,
    requestedOrganizationId,
    message: requestedOrganizationId
      ? "Account created and join request submitted."
      : "Account created. You can request organization access after sign in.",
  });
}
