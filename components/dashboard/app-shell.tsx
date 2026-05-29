"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/sidebar";
import {
  adminNavigation,
  userNavigation,
  type DashboardNavItem,
} from "@/components/dashboard/navigation";

type AppShellVariant = "user" | "admin";

const navigationByVariant: Record<AppShellVariant, DashboardNavItem[]> = {
  user: userNavigation,
  admin: adminNavigation,
};

type AppShellProps = {
  variant: AppShellVariant;
  children: React.ReactNode;
};

export function AppShell({ variant, children }: AppShellProps) {
  const items = navigationByVariant[variant];
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar items={items} />
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="border-b border-border bg-background/75 px-4 py-3 backdrop-blur-md lg:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileOpen((value) => !value)}
            className="gap-2"
          >
            <Menu className="h-4 w-4" />
            Menu
          </Button>
          {mobileOpen ? (
            <nav className="mt-3 grid gap-2">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          ) : null}
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
