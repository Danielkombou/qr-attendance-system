import { PanelCard } from "@/components/dashboard/panel-card";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[2.2rem] font-semibold tracking-[-0.03em]">User Management</h1>
        <p className="text-muted-foreground">Manage users and roles.</p>
      </header>
      <PanelCard title="Coming Next">
        <p className="text-muted-foreground">
          User listing and role updates will live here.
        </p>
      </PanelCard>
    </div>
  );
}
