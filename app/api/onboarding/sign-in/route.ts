import axios, { AxiosError } from "axios";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest } from "@/lib/server/api-utils";
import { applyAttendxSessionCookies } from "@/lib/server/session-cookies";

type SignInResult = { user?: { id: string } };

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = body?.email as string | undefined;
  const password = body?.password as string | undefined;

  if (!email || !password) {
    return badRequest("email and password are required");
  }

  let signIn: SignInResult;
  try {
    const response = await axios.post<SignInResult>(
      `${request.nextUrl.origin}/api/auth/sign-in/email`,
      { email, password, rememberMe: true },
      {
        headers: {
          "content-type": "application/json",
          cookie: request.headers.get("cookie") ?? "",
        },
        validateStatus: () => true,
      },
    );

    if (response.status < 200 || response.status >= 300) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: response.status });
    }

    signIn = response.data;
  } catch (error) {
    const status = error instanceof AxiosError ? (error.response?.status ?? 500) : 500;
    return NextResponse.json({ error: "Invalid credentials" }, { status });
  }

  const userId = signIn.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Sign in failed" }, { status: 500 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  const role = user?.role ?? Role.USER;
  const response = NextResponse.json({
    ok: true,
    redirectTo: role === Role.ADMIN ? "/admin/dashboard" : "/dashboard",
  });

  applyAttendxSessionCookies(response, { userId, role });
  return response;
}
