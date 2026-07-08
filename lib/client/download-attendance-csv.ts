import axios from "axios";

export async function downloadAttendanceCsv(date: string) {
  const response = await axios.get("/api/admin/attendance/export", {
    params: { date },
    responseType: "blob",
    validateStatus: () => true,
  });

  const contentType = String(response.headers["content-type"] ?? "");
  if (response.status >= 400 || contentType.includes("application/json")) {
    const text = await (response.data as Blob).text();
    try {
      const parsed = JSON.parse(text) as { error?: string };
      throw new Error(parsed.error ?? "Export failed.");
    } catch (err) {
      if (err instanceof Error && err.message !== "Export failed." && !err.message.startsWith("Unexpected")) {
        throw err;
      }
      throw new Error(
        response.status === 403 ? "Admin role required to export." : "Export failed.",
      );
    }
  }

  const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `attendance-${date}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
