export type WorkHours = {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
};

export const DEFAULT_WORK_HOURS: WorkHours = {
  startHour: 9,
  startMinute: 0,
  endHour: 19,
  endMinute: 0,
};

export type CheckInTimingLabel = "EARLY" | "ON_TIME" | "LATE";
export type CheckOutTimingLabel = "ON_TIME" | "AFTER_HOURS";

export function minutesOfDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function workStartMinutes(hours: WorkHours): number {
  return hours.startHour * 60 + hours.startMinute;
}

export function workEndMinutes(hours: WorkHours): number {
  return hours.endHour * 60 + hours.endMinute;
}

export function classifyCheckIn(checkedInAt: Date, hours: WorkHours = DEFAULT_WORK_HOURS): CheckInTimingLabel {
  const minute = minutesOfDay(checkedInAt);
  const start = workStartMinutes(hours);
  if (minute < start) return "EARLY";
  if (minute > start) return "LATE";
  return "ON_TIME";
}

export function classifyCheckOut(
  checkedOutAt: Date,
  hours: WorkHours = DEFAULT_WORK_HOURS,
): CheckOutTimingLabel {
  const minute = minutesOfDay(checkedOutAt);
  const end = workEndMinutes(hours);
  if (minute > end) return "AFTER_HOURS";
  return "ON_TIME";
}

export function isOnTimeCheckIn(checkedInAt: Date, hours: WorkHours = DEFAULT_WORK_HOURS): boolean {
  const timing = classifyCheckIn(checkedInAt, hours);
  return timing === "ON_TIME" || timing === "EARLY";
}

export function formatWorkHoursTime(hour: number, minute: number): string {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function formatCheckInTimingLabel(timing: CheckInTimingLabel): string {
  if (timing === "EARLY") return "Early";
  if (timing === "LATE") return "Late";
  return "On Time";
}

export function formatCheckOutTimingNote(timing: CheckOutTimingLabel): string | null {
  if (timing === "AFTER_HOURS") return "Checked out after hours";
  return null;
}

export function formatAttendanceLocation(input: {
  checkInLat?: number | null;
  checkInLng?: number | null;
  siteName?: string | null;
}): string {
  const hasCoords = input.checkInLat != null && input.checkInLng != null;
  if (hasCoords) {
    return input.siteName ? `${input.siteName} · Location included` : "Location included";
  }
  return input.siteName ?? "—";
}
