"use client";

import { useMemo, useState } from "react";
import { Clock3, Filter, MapPin, Search } from "lucide-react";
import { StatSummaryCard } from "@/components/dashboard/stat-summary-card";
import { PresenceDot } from "@/components/dashboard/presence-dot";
import { useTeamMembers } from "@/lib/queries/hooks";
import { semanticSurfaces } from "@/lib/ui/semantic-surfaces";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "Present" | "Absent";

export default function TeamPage() {
  const { data, isLoading, isError } = useTeamMembers();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const members = data?.members ?? [];
    const q = query.trim().toLowerCase();
    return members.filter((member) => {
      const matchesQuery =
        !q ||
        member.name.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || member.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [data?.members, query, statusFilter]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[2.2rem] font-semibold tracking-[-0.03em] text-foreground">Team Members</h1>
        <p className="text-muted-foreground">View team attendance and status</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatSummaryCard label="Total Team" value={data?.summary.total ?? "—"} />
        <StatSummaryCard label="Present" value={data?.summary.present ?? "—"} tone="success" />
        <StatSummaryCard label="Absent" value={data?.summary.absent ?? "—"} tone="warning" />
      </section>

      <section className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search team members</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, email, or role..."
              className="h-11 w-full rounded-xl border border-border bg-input-background py-2 pl-10 pr-3 text-sm text-foreground"
            />
          </label>
          <div className="relative min-w-[160px]">
            <Filter
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              aria-label="Filter by status"
              className="h-11 w-full appearance-none rounded-xl border border-border bg-input-background py-2 pl-10 pr-8 text-sm text-foreground"
            >
              <option value="all">All Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading team members…</p>
        ) : isError ? (
          <p className="mt-6 text-sm text-muted-foreground">Could not load team members.</p>
        ) : filtered.length === 0 ? (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {query || statusFilter !== "all" ? "No members match your filters." : "No team members yet."}
          </p>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((member) => (
              <article
                key={member.id}
                className={cn(
                  "rounded-2xl border p-4 shadow-sm",
                  member.status === "Present" ? semanticSurfaces.success : semanticSurfaces.neutral,
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="relative inline-flex shrink-0">
                      <span
                        className={cn(
                          "inline-flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold",
                          member.online
                            ? "bg-[var(--surface-success-fg)] text-white"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {member.initials}
                      </span>
                      <PresenceDot online={member.online} className="absolute -bottom-0.5 -right-0.5" />
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                      member.status === "Present"
                        ? "bg-[var(--surface-success-fg)] text-white"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {member.status}
                  </span>
                </div>

                <p className="mt-3 text-sm text-muted-foreground">• {member.email}</p>

                {member.status === "Present" && member.checkInTime ? (
                  <div className="mt-3 space-y-1.5 text-sm text-[var(--surface-success-fg)]">
                    <p className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      <span>
                        {member.checkInTime} · {member.duration}
                        {member.checkInNote ? ` · ${member.checkInNote}` : ""}
                      </span>
                    </p>
                    <p className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      <span>{member.location}</span>
                    </p>
                  </div>
                ) : (
                  <p className="mt-4 text-center text-sm text-muted-foreground">Not checked in today</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
