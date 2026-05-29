export function initialsFromName(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatClockTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDurationMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function minutesSince(date: Date, now = new Date()): number {
  return Math.max(0, Math.floor((now.getTime() - date.getTime()) / 60_000));
}

export function startOfDay(date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function dayKey(date: Date): string {
  return startOfDay(date).toISOString().slice(0, 10);
}

export function roleLabel(role: string): string {
  return role === "ADMIN" ? "Administrator" : "Team Member";
}

export function employeeId(userId: string, createdAt: Date): string {
  return `EMP-${createdAt.getFullYear()}-${userId.slice(-4).toUpperCase()}`;
}

export function isOnTimeCheckIn(checkedInAt: Date): boolean {
  const hours = checkedInAt.getHours();
  const minutes = checkedInAt.getMinutes();
  return hours < 9 || (hours === 9 && minutes <= 15);
}

/** Consecutive calendar days (from today) with at least one on-time check-in. */
export function computeOnTimeStreak(
  records: Array<{ checkedInAt: Date }>,
  isOnTime: (date: Date) => boolean = isOnTimeCheckIn,
): number {
  const onTimeDays = new Set(
    records.filter((r) => isOnTime(r.checkedInAt)).map((r) => dayKey(r.checkedInAt)),
  );

  let streak = 0;
  const cursor = startOfDay();

  while (onTimeDays.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

/** Consecutive calendar days (from today) with any attendance. */
export function computeAttendanceStreak(dayKeys: Set<string>): number {
  let streak = 0;
  const cursor = startOfDay();

  while (dayKeys.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
