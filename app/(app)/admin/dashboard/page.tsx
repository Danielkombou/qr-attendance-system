"use client";

import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Search } from "lucide-react";
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
  const [banner, setBanner] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const loadMetrics = useCallback(async () => {
    try {
      const { data } = await axios.get<{ metrics: Metrics }>("/api/dashboard/admin");
      setMetrics(data.metrics);
    } catch {
      setMetrics(null);
    }
  }, []);

  const search = useCallback(async (q: string) => {
    setSearching(true);
    setBanner(null);
    try {
      const { data } = await axios.get<{ users: UserRow[] }>("/api/admin/users/search", {
        params: { q },
      });
      setUsers(data.users ?? []);
    } catch (err) {
      setUsers([]);
      if (err instanceof AxiosError) {
        setBanner({ type: "err", text: err.response?.data?.error ?? "Search failed." });
      }
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
    setBanner(null);
    try {
      await axios.patch(`/api/admin/users/${userId}/role`, { role });
      setBanner({ type: "ok", text: role === "ADMIN" ? "User is now an admin." : "User is now a standard user." });
      await loadMetrics();
      await search(query.trim());
    } catch (err) {
      if (err instanceof AxiosError) {
        setBanner({ type: "err", text: (err.response?.data as { error?: string })?.error ?? "Update failed." });
      }
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

      {banner ? (
        <p className={banner.type === "ok" ? "text-sm text-emerald-600" : "text-sm text-red-600"}>{banner.text}</p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="mt-2 text-[2.2rem] font-semibold">{metrics?.totalUsers ?? "—"}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm text-emerald-700">Checked in now</p>
          <p className="mt-2 text-[2.2rem] font-semibold text-emerald-700">{metrics?.activeNow ?? "—"}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm text-amber-700">Check-ins today</p>
          <p className="mt-2 text-[2.2rem] font-semibold text-amber-700">{metrics?.todayCheckIns ?? "—"}</p>
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
