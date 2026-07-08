"use client";

import { useEffect, useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import { Download, Pencil, Search, Trash2, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { StatSummaryCard } from "@/components/dashboard/stat-summary-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { Button } from "@/components/ui/button";
import {
  useAdminUsers,
  useCreateAdminUserMutation,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
} from "@/lib/queries/hooks";
import { pageSubtitleClass, pageTitleClass } from "@/lib/ui/page-styles";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

function todayInputValue() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

async function downloadAttendanceCsv(date: string) {
  const response = await axios.get("/api/admin/attendance/export", {
    params: { date },
    responseType: "blob",
  });
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

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [exportDate, setExportDate] = useState(todayInputValue);
  const [exporting, setExporting] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "USER" as "USER" | "ADMIN" });

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(handle);
  }, [query]);

  const { data, isLoading, isError, isFetching } = useAdminUsers({
    q: debouncedQuery,
    page,
    limit: PAGE_SIZE,
  });

  const createUser = useCreateAdminUserMutation();
  const updateRole = useUpdateUserRoleMutation();
  const deleteUser = useDeleteUserMutation();

  const pagination = data?.pagination;
  const users = data?.users ?? [];
  const summary = data?.summary;

  const editingUser = useMemo(
    () => users.find((u) => u.id === editUserId) ?? null,
    [users, editUserId],
  );

  async function onExport() {
    setExporting(true);
    try {
      await downloadAttendanceCsv(exportDate);
      toast.success("Attendance CSV downloaded.");
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as { error?: string } | undefined)?.error ?? "Export failed."
          : "Export failed.";
      toast.error(message);
    } finally {
      setExporting(false);
    }
  }

  async function onCreateUser(event: React.FormEvent) {
    event.preventDefault();
    const toastId = toast.loading("Creating user…");
    try {
      await createUser.mutateAsync(form);
      toast.success("User created.", { id: toastId });
      setAddOpen(false);
      setForm({ name: "", email: "", password: "", role: "USER" });
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as { error?: string } | undefined)?.error ?? "Could not create user."
          : "Could not create user.";
      toast.error(message, { id: toastId });
    }
  }

  async function onSetRole(userId: string, role: "USER" | "ADMIN") {
    const toastId = toast.loading(role === "ADMIN" ? "Promoting user…" : "Demoting user…");
    try {
      await updateRole.mutateAsync({ userId, role });
      toast.success(role === "ADMIN" ? "User is now an admin." : "User is now a standard user.", {
        id: toastId,
      });
      setEditUserId(null);
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as { error?: string } | undefined)?.error ?? "Role update failed."
          : "Role update failed.";
      toast.error(message, { id: toastId });
    }
  }

  async function onDeleteUser(userId: string, name: string) {
    const confirmed = window.confirm(`Delete ${name}? This cannot be undone.`);
    if (!confirmed) return;
    const toastId = toast.loading("Deleting user…");
    try {
      await deleteUser.mutateAsync(userId);
      toast.success("User deleted.", { id: toastId });
      setEditUserId(null);
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as { error?: string } | undefined)?.error ?? "Delete failed."
          : "Delete failed.";
      toast.error(message, { id: toastId });
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <span>
          <h1 className={pageTitleClass}>Admin Panel</h1>
          <p className={pageSubtitleClass}>Manage users and system settings</p>
        </span>
        <Button
          type="button"
          className="h-10 rounded-xl px-4"
          onClick={() => setAddOpen(true)}
        >
          <UserPlus className="h-4 w-4" aria-hidden />
          Add User
        </Button>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatSummaryCard label="Total Users" value={summary?.total ?? "—"} />
        <StatSummaryCard label="Present" value={summary?.present ?? "—"} tone="success" />
        <StatSummaryCard label="Absent" value={summary?.absent ?? "—"} tone="warning" />
      </section>

      <section className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search users</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search users..."
              className="h-11 w-full rounded-xl border border-border bg-input-background py-2 pl-10 pr-3 text-sm text-foreground"
            />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="grid gap-1">
              <span className="sr-only">Export date</span>
              <input
                type="date"
                value={exportDate}
                onChange={(event) => setExportDate(event.target.value)}
                className="h-11 rounded-xl border border-border bg-input-background px-3 text-sm text-foreground"
              />
            </label>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl px-4"
              disabled={exporting}
              onClick={() => void onExport()}
            >
              <Download className="h-4 w-4" aria-hidden />
              {exporting ? "Exporting…" : "Export CSV"}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading users…</p>
        ) : isError ? (
          <p className="mt-6 text-sm text-muted-foreground">Could not load users.</p>
        ) : (
          <>
            <div className="mt-5 overflow-x-auto rounded-xl border border-border/80">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-muted/70 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="bg-card">
                        <td className="px-4 py-3 font-semibold text-foreground">{user.name}</td>
                        <td className="px-4 py-3 text-foreground">{user.email}</td>
                        <td className="px-4 py-3 text-foreground">{user.role}</td>
                        <td className="px-4 py-3">
                          <StatusPill variant={user.status === "Present" ? "success" : "warning"}>
                            {user.status.toLowerCase()}
                          </StatusPill>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              size="icon-sm"
                              variant="ghost"
                              aria-label={`Edit ${user.name}`}
                              onClick={() => setEditUserId(user.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="icon-sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              aria-label={`Delete ${user.name}`}
                              disabled={deleteUser.isPending}
                              onClick={() => void onDeleteUser(user.id, user.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {pagination
                  ? `Page ${pagination.page} of ${pagination.totalPages} · ${pagination.total} users`
                  : null}
                {isFetching && !isLoading ? " · Updating…" : null}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  disabled={!pagination || pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  disabled={!pagination || pagination.page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </section>

      {addOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-user-title"
            className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-lg"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 id="add-user-title" className="text-lg font-semibold">
                  Add User
                </h2>
                <p className="text-sm text-muted-foreground">Create an account for a team member.</p>
              </div>
              <Button type="button" size="icon-sm" variant="ghost" onClick={() => setAddOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form className="space-y-3" onSubmit={(event) => void onCreateUser(event)}>
              <label className="grid gap-1.5">
                <span className="text-sm font-medium">Name</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="h-11 rounded-xl border border-border bg-input-background px-3 text-sm"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-medium">Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="h-11 rounded-xl border border-border bg-input-background px-3 text-sm"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-medium">Temporary password</span>
                <input
                  required
                  type="password"
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="h-11 rounded-xl border border-border bg-input-background px-3 text-sm"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-medium">Role</span>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, role: e.target.value as "USER" | "ADMIN" }))
                  }
                  className="h-11 rounded-xl border border-border bg-input-background px-3 text-sm"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createUser.isPending}>
                  {createUser.isPending ? "Creating…" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {editingUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-user-title"
            className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-lg"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 id="edit-user-title" className="text-lg font-semibold">
                  Edit role
                </h2>
                <p className="text-sm text-muted-foreground">{editingUser.email}</p>
              </div>
              <Button type="button" size="icon-sm" variant="ghost" onClick={() => setEditUserId(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="mb-4 text-sm text-foreground">
              Current role: <span className="font-semibold">{editingUser.role}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {editingUser.role !== "ADMIN" ? (
                <Button
                  type="button"
                  disabled={updateRole.isPending}
                  onClick={() => void onSetRole(editingUser.id, "ADMIN")}
                >
                  Make admin
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  disabled={updateRole.isPending}
                  onClick={() => void onSetRole(editingUser.id, "USER")}
                >
                  Make user
                </Button>
              )}
              <Button
                type="button"
                variant="destructive"
                disabled={deleteUser.isPending}
                onClick={() => void onDeleteUser(editingUser.id, editingUser.name)}
              >
                Delete user
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
