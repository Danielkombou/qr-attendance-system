import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PanelCard } from "@/components/dashboard/panel-card";

const users = [
  { name: "Sarah Johnson", email: "sarah.johnson@company.com", dept: "Engineering", role: "Tech Lead", status: "active", joinDate: "2023-01-15" },
  { name: "Mike Chen", email: "mike.chen@company.com", dept: "Engineering", role: "Senior Developer", status: "active", joinDate: "2023-03-20" },
  { name: "Emily Davis", email: "emily.davis@company.com", dept: "Design", role: "UI/UX Designer", status: "active", joinDate: "2023-02-10" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <span>
          <h1 className="text-[2.2rem] font-semibold tracking-[-0.03em]">Admin Panel</h1>
          <p className="text-muted-foreground">Manage users and system settings</p>
        </span>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </header>
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="mt-2 text-[2.2rem] font-semibold">5</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm text-emerald-700">Active Users</p>
          <p className="mt-2 text-[2.2rem] font-semibold text-emerald-700">4</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm text-amber-700">Inactive Users</p>
          <p className="mt-2 text-[2.2rem] font-semibold text-amber-700">1</p>
        </div>
      </section>

      <PanelCard title="Users">
        <div className="mb-4 rounded-xl border border-border bg-muted/50 px-4 py-3 text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search users...
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-muted/70 text-sm text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Department</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Join Date</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.email}>
                  <td className="px-3 py-3 font-medium">{user.name}</td>
                  <td className="px-3 py-3">{user.email}</td>
                  <td className="px-3 py-3">{user.dept}</td>
                  <td className="px-3 py-3">{user.role}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs text-emerald-700">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">{user.joinDate}</td>
                  <td className="px-3 py-3 text-muted-foreground">edit · remove</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>
    </div>
  );
}
