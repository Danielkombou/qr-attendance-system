import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAttendanceSettings } from "@/lib/server/attendance-settings";
import { requireContext } from "@/lib/server/api-utils";
import { buildReportsAnalytics } from "@/lib/server/reports-analytics";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { error, context } = requireContext(request);
  if (error || !context) return error;

  const workHours = await getAttendanceSettings();
  const analytics = await buildReportsAnalytics(workHours);
  return NextResponse.json(analytics);
}
