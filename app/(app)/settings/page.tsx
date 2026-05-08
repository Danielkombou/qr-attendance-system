import { PanelCard } from "@/components/dashboard/panel-card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[2.2rem] font-semibold tracking-[-0.03em]">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and system configuration</p>
      </header>
      <PanelCard title="General Settings">
        <div className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Organization Name</span>
            <input className="h-11 rounded-lg border border-border bg-input-background px-3" defaultValue="TechCorp Inc." />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Timezone</span>
            <select className="h-11 rounded-lg border border-border bg-input-background px-3">
              <option>UTC-8 (Pacific Time)</option>
              <option>UTC+1 (West Africa Time)</option>
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Date Format</span>
            <select className="h-11 rounded-lg border border-border bg-input-background px-3">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
            </select>
          </label>
        </div>
      </PanelCard>
      <PanelCard title="Working Hours">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Start Time</span>
            <input className="h-11 rounded-lg border border-border bg-input-background px-3" defaultValue="09:00 AM" />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">End Time</span>
            <input className="h-11 rounded-lg border border-border bg-input-background px-3" defaultValue="05:00 PM" />
          </label>
        </div>
      </PanelCard>
    </div>
  );
}
