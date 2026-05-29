import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { badRequest } from "@/lib/server/api-utils";
import { authErrorResponse } from "@/lib/server/auth-errors";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const name = body?.name as string | undefined;
  const email = body?.email as string | undefined;
  const password = body?.password as string | undefined;

  if (!name || !email || !password) {
    return badRequest("name, email, and password are required");
  }

  try {
    await auth.api.signUpEmail({
      body: { name, email, password, rememberMe: true },
      headers: request.headers,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error, "Unable to create account");
  }
}
