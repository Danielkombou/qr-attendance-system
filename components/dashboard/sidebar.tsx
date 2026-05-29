"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";
import type { DashboardNavItem } from "@/components/dashboard/navigation";

type SidebarProps = {
  items: DashboardNavItem[];
};

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[232px] shrink-0 border-r border-border bg-background/75 backdrop-blur-md lg:block">
      <div className="sticky top-0 flex h-screen flex-col px-3 py-5">
        <BrandLogo className="px-2" />
        <nav className="mt-8 space-y-1">
          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-[1rem] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  active && "bg-primary text-primary-foreground hover:bg-primary/95 hover:text-primary-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
