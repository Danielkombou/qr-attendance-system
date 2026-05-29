import type { Role } from "@/lib/roles";
import { NextResponse } from "next/server";

type SessionCookieInput = {
  userId: string;
  role: Role;
};

const baseCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export function applyAttendxSessionCookies(response: NextResponse, input: SessionCookieInput) {
  const options = { ...baseCookieOptions, maxAge: 60 * 60 * 24 * 7 };
  response.cookies.set("attendx_user_id", input.userId, options);
  response.cookies.set("attendx_role", input.role, options);
}

export function clearAttendxSessionCookies(response: NextResponse) {
  const options = { ...baseCookieOptions, maxAge: 0 };
  response.cookies.set("attendx_user_id", "", options);
  response.cookies.set("attendx_role", "", options);
}
