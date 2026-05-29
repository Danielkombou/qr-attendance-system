"use client";

import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PanelCard } from "@/components/dashboard/panel-card";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
};

type Metrics = { totalUsers: number; activeNow: number; todayCheckIns: number };

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [searching, setSearching] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadMetrics = useCallback(async () => {
    try {
      const { data } = await axios.get<{ metrics: Metrics }>("/api/dashboard/admin");
      setMetrics(data.metrics);
    } catch {
      setMetrics(null);
      toast.error("Could not load dashboard metrics.");
    }
  }, []);

  const search = useCallback(async (q: string) => {
    setSearching(true);
    try {
      const { data } = await axios.get<{ users: UserRow[] }>("/api/admin/users/search", {
        params: { q },
      });
      setUsers(data.users ?? []);
    } catch (err) {
      setUsers([]);
      const message =
        err instanceof AxiosError
          ? (err.response?.data as { error?: string } | undefined)?.error ?? "Search failed."
          : "Search failed.";
      toast.error(message);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    void loadMetrics();
  }, [loadMetrics]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      void search(query.trim());
    }, 300);
    return () => window.clearTimeout(handle);
  }, [query, search]);

  async function setRole(userId: string, role: "USER" | "ADMIN") {
    setUpdatingId(userId);
    const toastId = toast.loading(role === "ADMIN" ? "Promoting user…" : "Demoting user…");
    try {
      await axios.patch(`/api/admin/users/${userId}/role`, { role });
      toast.success(role === "ADMIN" ? "User is now an admin." : "User is now a standard user.", {
        id: toastId,
      });
      await loadMetrics();
      await search(query.trim());
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as { error?: string } | undefined)?.error ?? "Update failed."
          : "Update failed.";
      toast.error("Role update failed", { id: toastId, description: message });
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[2.2rem] font-semibold tracking-[-0.03em]">Admin Panel</h1>
        <p className="text-muted-foreground">Search by name or email, then change role</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/80 bg-card p-5 text-card-foreground shadow-sm">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="mt-2 text-[2.2rem] font-semibold text-foreground">{metrics?.totalUsers ?? "—"}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50 p-5 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/50">
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Checked in now</p>
          <p className="mt-2 text-[2.2rem] font-semibold text-emerald-900 dark:text-emerald-200">
            {metrics?.activeNow ?? "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-amber-200/90 bg-amber-50 p-5 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/50">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Check-ins today</p>
          <p className="mt-2 text-[2.2rem] font-semibold text-amber-900 dark:text-amber-200">
            {metrics?.todayCheckIns ?? "—"}
          </p>
        </div>
      </section>

      <PanelCard title="Find user & update role">
        <label className="mb-4 block space-y-1.5">
          <span className="text-sm font-medium">Search by email or name</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 w-full rounded-lg border border-border bg-input-background py-2 pl-10 pr-3"
              placeholder="e.g. jane@company.com"
            />
          </div>
        </label>
        <p className="mb-3 text-xs text-muted-foreground">
          New sign-ups are always <span className="font-medium">USER</span> until you promote them here.
        </p>

        {searching && query.trim() ? <p className="text-sm text-muted-foreground">Searching…</p> : null}

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/70 text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.length === 0 && !searching ? (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-muted-foreground">
                    {query.trim() ? "No matches." : "Type to search users."}
                  </td>
                </tr>
              ) : null}
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-3 py-3 font-medium">{user.name}</td>
                  <td className="px-3 py-3">{user.email}</td>
                  <td className="px-3 py-3">{user.role}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      {user.role !== "ADMIN" ? (
                        <Button
                          size="sm"
                          disabled={updatingId === user.id}
                          onClick={() => void setRole(user.id, "ADMIN")}
                        >
                          Make admin
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={updatingId === user.id}
                          onClick={() => void setRole(user.id, "USER")}
                        >
                          Make user
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>
    </div>
  );
}
