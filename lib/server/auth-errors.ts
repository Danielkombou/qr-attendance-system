import { isAPIError } from "better-auth/api";
import { NextResponse } from "next/server";

const STATUS_CODE_MAP: Record<string, number> = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

export function authErrorResponse(error: unknown, fallbackMessage: string, fallbackStatus = 500) {
  if (isAPIError(error)) {
    const code = (error as { status?: string | number }).status;
    const message = (error as { message?: string }).message ?? fallbackMessage;
    const status =
      typeof code === "number"
        ? code
        : typeof code === "string"
        ? STATUS_CODE_MAP[code] ?? fallbackStatus
        : fallbackStatus;
    return NextResponse.json({ error: message }, { status });
  }
  console.error("[auth] unexpected error:", error);
  return NextResponse.json({ error: fallbackMessage }, { status: fallbackStatus });
}
