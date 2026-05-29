"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { ShellActions } from "@/components/dashboard/shell-actions";
import { sidebarNavLinkClass } from "@/lib/ui/sidebar-action-styles";
import { cn } from "@/lib/utils";
import type { DashboardNavItem } from "@/components/dashboard/navigation";

type SidebarProps = {
  items: DashboardNavItem[];
};

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[232px] shrink-0 border-r border-border/80 bg-card/90 backdrop-blur-md lg:block">
      <div className="sticky top-0 flex h-screen flex-col px-3 py-5">
        <BrandLogo className="px-2" />
        <nav className="mt-8 flex-1 space-y-1 overflow-y-auto" aria-label="Main">
          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  sidebarNavLinkClass,
                  "text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  active &&
                    "bg-primary text-primary-foreground hover:bg-primary/95 hover:text-primary-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <ShellActions layout="sidebar" className="mt-4 border-t border-border pt-4" />
      </div>
    </aside>
  );
}
