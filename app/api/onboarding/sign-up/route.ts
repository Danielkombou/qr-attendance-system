import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { badRequest } from "@/lib/server/api-utils";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const name = body?.name as string | undefined;
  const email = body?.email as string | undefined;
  const password = body?.password as string | undefined;

  if (!name || !email || !password) {
    return badRequest("name, email, and password are required");
  }

  try {
    const response = await axios.post(
      `${request.nextUrl.origin}/api/auth/sign-up/email`,
      { name, email, password, rememberMe: true },
      {
        headers: {
          "content-type": "application/json",
          cookie: request.headers.get("cookie") ?? "",
        },
        validateStatus: () => true,
      },
    );

    if (response.status < 200 || response.status >= 300) {
      return NextResponse.json({ error: "Unable to create account" }, { status: response.status });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error instanceof AxiosError ? (error.response?.status ?? 500) : 500;
    return NextResponse.json({ error: "Unable to create account" }, { status });
  }
}
