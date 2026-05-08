import { Clock3, MapPin, Search } from "lucide-react";
import { PanelCard } from "@/components/dashboard/panel-card";

const members = [
  { initials: "SJ", name: "Sarah Johnson", role: "Tech Lead", status: "Present", team: "Engineering", in: "08:45 AM", duration: "3h 25m", location: "Office - Floor 3" },
  { initials: "MC", name: "Mike Chen", role: "Senior Developer", status: "Absent", team: "Engineering", in: "-", duration: "-", location: "Not checked in today" },
  { initials: "ED", name: "Emily Davis", role: "UI/UX Designer", status: "Present", team: "Design", in: "09:02 AM", duration: "3h 08m", location: "Office - Floor 2" },
];

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[2.2rem] font-semibold tracking-[-0.03em]">Team Members</h1>
        <p className="text-muted-foreground">View team attendance and status</p>
      </header>
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Team</p>
          <p className="mt-2 text-[2.2rem] font-semibold">8</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm text-emerald-700">Present</p>
          <p className="mt-2 text-[2.2rem] font-semibold text-emerald-700">5</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm text-amber-700">Absent</p>
          <p className="mt-2 text-[2.2rem] font-semibold text-amber-700">3</p>
        </div>
      </section>

      <PanelCard title="Directory">
        <div className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search by name, department, or role...
          </span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
            <article key={member.name} className={`rounded-2xl border p-4 ${member.status === "Present" ? "border-emerald-200 bg-emerald-50" : "border-border bg-card"}`}>
              <div className="flex items-start justify-between">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {member.initials}
                </span>
                <span className={`rounded-full px-2.5 py-1 text-xs ${member.status === "Present" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                  {member.status}
                </span>
              </div>
              <p className="mt-3 text-[1.35rem] font-semibold">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.role}</p>
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                <p>• {member.team}</p>
                <p className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {member.in} · {member.duration}</p>
                <p className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {member.location}</p>
              </div>
            </article>
          ))}
        </div>
      </PanelCard>
    </div>
  );
}
