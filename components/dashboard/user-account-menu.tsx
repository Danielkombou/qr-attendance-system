"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronUp, LogOut, Settings } from "lucide-react";
import { UserAvatar } from "@/components/dashboard/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { useSignOut } from "@/lib/hooks/use-sign-out";
import { useProfile } from "@/lib/queries/hooks";
import { cn } from "@/lib/utils";

type UserAccountMenuProps = {
  className?: string;
  /** Compact trigger for the top header; full-width trigger for the sidebar footer. */
  placement?: "header" | "sidebar";
};

function shortRole(role: string) {
  return role.toLowerCase().includes("admin") ? "Admin" : "Member";
}

export function UserAccountMenu({ className, placement = "header" }: UserAccountMenuProps) {
  const { data: profile, isLoading } = useProfile();
  const signOut = useSignOut();
  const [open, setOpen] = useState(false);
  const { state: sidebarState } = useSidebar();

  const user = profile?.user;
  const initials = user?.initials ?? "…";
  const name = user?.name ?? "Loading…";
  const email = user?.email ?? "";
  const role = user ? shortRole(user.role) : "—";
  const isSidebar = placement === "sidebar";
  const collapsed = isSidebar && sidebarState === "collapsed";

  if (isLoading && !user) {
    return (
      <div
        className={cn(
          "animate-pulse rounded-xl bg-muted/60",
          isSidebar ? "h-12 w-full" : "h-11 w-44",
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-3 rounded-xl border border-border bg-card text-left text-foreground shadow-xs outline-none transition-colors hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring",
          isSidebar
            ? cn(
                "h-12 w-full px-3",
                collapsed &&
                  "size-10 justify-center border-transparent bg-transparent px-0 shadow-none hover:bg-sidebar-accent",
              )
            : "h-11 max-w-[15rem] px-3 py-2",
          className,
        )}
        aria-label={collapsed ? `${name}, account menu` : "Account menu"}
      >
        <UserAvatar initials={initials} size={isSidebar ? "sm" : "md"} />
        {!collapsed ? (
          <>
            <span className={cn("min-w-0 flex-1", !isSidebar && "hidden min-[480px]:block")}>
              <span className="block truncate text-sm font-semibold leading-tight">{name}</span>
              <span className="block truncate text-xs text-muted-foreground">{role}</span>
            </span>
            <ChevronUp
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                open ? "rotate-0" : "rotate-180",
                !isSidebar && "hidden min-[480px]:block",
              )}
              aria-hidden
            />
          </>
        ) : null}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={isSidebar ? "start" : "end"}
        side={isSidebar ? "top" : "bottom"}
        sideOffset={8}
        className="w-64 p-0"
      >
        <div className="flex items-center gap-3 rounded-t-lg bg-muted/50 px-3 py-3">
          <UserAvatar initials={initials} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
        </div>

        <div className="p-1">
          <DropdownMenuItem render={<Link href="/settings" />} className="gap-2.5 px-2.5 py-2">
            <Settings className="size-4 text-muted-foreground" aria-hidden />
            Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            className="gap-2.5 px-2.5 py-2"
            disabled={signOut.isPending}
            onClick={() => void signOut.mutate()}
          >
            <LogOut className="size-4" aria-hidden />
            {signOut.isPending ? "Signing out…" : "Sign Out"}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
