import axios from "axios";

export async function downloadAttendanceCsv(date: string) {
  const response = await axios.get("/api/admin/attendance/export", {
    params: { date },
    responseType: "blob",
    validateStatus: () => true,
  });

  if (response.status >= 400) {
    const text = await (response.data as Blob).text();
    try {
      const parsed = JSON.parse(text) as { error?: string };
      throw new Error(parsed.error ?? "Export failed.");
    } catch (err) {
      if (err instanceof SyntaxError) {
        throw new Error(
          response.status === 403 ? "Admin role required to export." : "Export failed.",
        );
      }
      throw err;
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
