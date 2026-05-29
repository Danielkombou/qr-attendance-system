import { cn } from "@/lib/utils";

/** Shared row layout for sidebar actions (theme, sign out) — icons align with label text */
export const sidebarActionRowClass = cn(
  "inline-flex h-10 w-full items-center gap-2.5 rounded-xl px-3 text-sm font-medium leading-none",
);

export const sidebarNavLinkClass = cn(
  "flex items-center gap-2.5 rounded-xl px-3 py-3 text-[1rem] font-medium leading-none",
);
